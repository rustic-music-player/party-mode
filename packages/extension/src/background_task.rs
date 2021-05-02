use rustic_extension_api::ExtensionRuntime;
use tokio::sync::mpsc;
use tokio_tungstenite::{WebSocketStream, connect_async, MaybeTlsStream};
use tokio::net::TcpStream;
use rustic_core::{Track, ProviderType};
use tokio_tungstenite::tungstenite::Message;
use serde::{Deserialize, Serialize};
use futures_util::SinkExt;
use futures::stream::StreamExt;

#[derive(Debug, Clone)]
pub enum PlayerEvent {
    QueueUpdated,
}

pub struct PartyModeBackgroundRunner {
    runtime: ExtensionRuntime,
    socket: WebSocketStream<MaybeTlsStream<TcpStream>>,
    events: mpsc::Receiver<PlayerEvent>,
}

impl PartyModeBackgroundRunner {
    pub async fn new(runtime: ExtensionRuntime, events: mpsc::Receiver<PlayerEvent>, server_url: String, server_code: String) -> Result<Self, failure::Error> {
        println!("creating background task...");
        println!("connecting to websocket...");
        let url = format!("{}/api/server?serverId={}", server_url, server_code);
        let (socket, _) = connect_async(url).await?;

        Ok(Self {
            runtime,
            socket,
            events,
        })
    }


    pub async fn run(mut self) -> Result<(), failure::Error> {
        loop {
            tokio::select! {
                event = self.events.recv() => {
                    if let Some(event) = event {
                        self.handle_player_event(event).await?;
                    }
                },
                msg = self.socket.next() => {
                    if let Some(msg) = msg {
                        self.handle_socket_command(msg?).await?;
                    }
                },
            };
        }
    }

    async fn handle_socket_command(&mut self, msg: Message) -> Result<(), failure::Error> {
        println!("handling socket command {:?}", msg);
        if let Message::Text(msg) = msg {

            Ok(())
        }else {
            // TODO: log::warn would not display anything because the log context is not shared between host and extensions
            println!("unhandled socket message: {:?}", msg);
            Ok(())
        }
    }

    async fn handle_player_event(&mut self, event: PlayerEvent) -> Result<(), failure::Error> {
        match event {
            PlayerEvent::QueueUpdated => {
                let msg = SocketEvent::QueueUpdated(vec![]);
                let msg = serde_json::to_string(&msg)?;
                let msg = Message::Text(msg);
                self.socket.send(msg).await?;
            }
        }
        Ok(())
    }
}

#[derive(Debug, Clone, Deserialize)]
pub enum SocketCommand {

}

#[derive(Debug, Clone, Serialize)]
#[serde(tag = "type")]
pub enum SocketEvent {
    QueueUpdated(Vec<PartyTrack>)
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
        Self {
            url: track.uri,
            provider: track.provider,
            title: track.title,
            album: track.album.map(|album| album.title),
            artist: track.artist.map(|artist| artist.name),
            votes: 0,
            cover_url: track.thumbnail.to_url(),
            thumbnail_url: track.thumbnail.to_url(),
        }
    }
}
