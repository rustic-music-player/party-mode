use futures::stream::StreamExt;
use futures_util::SinkExt;
use serde::{Deserialize, Serialize};
use tokio::net::TcpStream;
use tokio_tungstenite::{connect_async, MaybeTlsStream, WebSocketStream};
use tokio_tungstenite::tungstenite::Message;

use rustic_core::{PlayerEvent, ProviderType, Track};
use rustic_core::provider::{ProviderItemType, Thumbnail, ThumbnailState};
use rustic_extension_api::ExtensionRuntime;
use rustic_api::cursor::to_cursor;

pub struct PartyModeBackgroundRunner {
    base_url: String,
    runtime: ExtensionRuntime,
    socket: WebSocketStream<MaybeTlsStream<TcpStream>>,
}

impl PartyModeBackgroundRunner {
    pub async fn new(runtime: ExtensionRuntime, base_url: String, server_code: String) -> Result<Self, failure::Error> {
        println!("creating background task...");
        let server_url = base_url.replace("https:", "wss:").replace("http:", "ws:");
        let url = format!("{}/api/server?serverId={}", server_url, server_code);
        println!("connecting to websocket...");
        let (socket, _) = connect_async(url).await?;

        Ok(Self {
            base_url,
            runtime,
            socket,
        })
    }


    pub async fn run(mut self) -> Result<(), failure::Error> {
        println!("running party mode");
        let player = self.runtime.get_player_or_default(None)?;
        let mut player_events = player.observe();
        loop {
            tokio::select! {
                event = player_events.recv_async() => {
                    let event = event?;
                    self.handle_player_event(event).await?;
                },
                msg = self.socket.next() => {
                    if let Some(msg) = msg {
                        self.handle_socket_command(msg?).await?;
                    }
                },
            }
        }
    }

    async fn handle_socket_command(&mut self, msg: Message) -> Result<(), failure::Error> {
        println!("handling socket command {:?}", msg);
        if let Message::Text(msg) = msg {
            Ok(())
        } else {
            // TODO: log::warn would not display anything because the log context is not shared between host and extensions
            println!("unhandled socket message: {:?}", msg);
            Ok(())
        }
    }

    async fn handle_player_event(&mut self, event: PlayerEvent) -> Result<(), failure::Error> {
        println!("got player event {:?}", event);
        match event {
            PlayerEvent::TrackChanged(track) => {
                self.upload_image(track.clone()).await?;
                let msg = SocketEvent::NowPlayingUpdated { track: Some(track.into()) };
                self.send_msg(msg).await?;
            }
            PlayerEvent::QueueUpdated(tracks) => {
                let queue = tracks.split(|q| q.playing).last().unwrap_or_default();
                for track in queue {
                    self.upload_image(track.track.clone()).await?;
                }
                let queue = queue.into_iter().map(|entry| PartyTrack::from(entry.track.clone())).collect();
                let msg = SocketEvent::QueueUpdated { tracks: queue };
                self.send_msg(msg).await?;
            }
            _ => {}
        }
        Ok(())
    }

    async fn send_msg<M: Serialize>(&mut self, msg: M) -> Result<(), failure::Error> {
        let msg = serde_json::to_string(&msg)?;
        let msg = Message::Text(msg);
        self.socket.send(msg).await?;

        Ok(())
    }

    async fn upload_image(&self, track: Track) -> Result<(), failure::Error> {
        match track.thumbnail {
            ThumbnailState::Data => {
                let uri = track.uri.clone();
                if let Some(thumbnail) = self.runtime.get_thumbnail(&ProviderItemType::Track(track)).await? {
                    if let Thumbnail::Data {
                        data,
                        mime_type
                    } = thumbnail {
                        let cursor = to_cursor(&uri);
                        let url = format!("{}/api/images/upload/{}", &self.base_url, cursor);
                        tokio::spawn(async move {
                            println!("uploading image to {}", url);
                            surf::post(url)
                                .header("Content-Type", mime_type)
                                .body(surf::Body::from_bytes(data))
                                .await
                                .unwrap();
                        });
                    };
                }
            }
            ThumbnailState::Url(url) => {
                let image_import = ImageImport {
                    url,
                    track: track.uri,
                };
                let url = format!("{}/api/images/import", &self.base_url);
                tokio::spawn(async move {
                    println!("importing image");
                    surf::post(url)
                        .body(surf::Body::from_json(&image_import).unwrap()).await.unwrap();
                });
            }
            _ => {}
        }
        Ok(())
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ImageUpload {
    track: String,
    thumbnail: Thumbnail,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ImageImport {
    track: String,
    url: String,
}

#[derive(Debug, Clone, Deserialize)]
pub enum SocketCommand {}

#[derive(Debug, Clone, Serialize)]
#[serde(tag = "type")]
pub enum SocketEvent {
    #[serde(rename = "server/queue/updated")]
    QueueUpdated { tracks: Vec<PartyTrack> },
    #[serde(rename = "server/now-playing/updated")]
    NowPlayingUpdated { track: Option<PartyTrack> },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PartyTrack {
    url: String,
    title: String,
    artist: Option<String>,
    album: Option<String>,
    votes: u64,
    provider: ProviderType,
    cover_url: Option<String>,
    thumbnail_url: Option<String>,
}

impl From<Track> for PartyTrack {
    fn from(track: Track) -> Self {
        let thumbnail_url = get_thumbnail_url(&track);
        Self {
            url: track.uri,
            provider: track.provider,
            title: track.title,
            album: track.album.map(|album| album.title),
            artist: track.artist.map(|artist| artist.name),
            votes: 0,
            cover_url: thumbnail_url.clone(),
            thumbnail_url,
        }
    }
}

fn get_thumbnail_url(track: &Track) -> Option<String> {
    match track.thumbnail {
        ThumbnailState::Url(ref url) => Some(url.clone()),
        ThumbnailState::Data => Some(format!("/api/images/{}", to_cursor(&track.uri))),
        _ => None
    }
}
