use std::collections::HashMap;

use async_trait::async_trait;

use rustic_core::Track;
use rustic_extension_api::*;

use tokio::sync::Mutex;
use tokio::task::JoinHandle;
use crate::background_task::{PartyModeBackgroundRunner, PlayerEvent};
use rustic_core::library::MetaValue;
use rand::prelude::*;
use rand::distributions::Alphanumeric;
use failure::Error;

mod background_task;

const REFRESH_SERVER_CODE: &str = "PARTY_MODE_REFRESH_CODE";
const SERVER_CODE_STORAGE_TOKEN: &str = "server_code";

#[derive(Debug)]
pub struct PartyModeExtension {
    server: String,
    runtime: Option<ExtensionRuntime>,
    background_task: Mutex<Option<JoinHandle<Result<(), failure::Error>>>>,
    background_bus: Mutex<Option<tokio::sync::mpsc::Sender<PlayerEvent>>>,
    tokio_runtime: tokio::runtime::Runtime,
}

impl ExtensionLibrary for PartyModeExtension {
    fn new(config: HashMap<String, ExtensionConfigValue>) -> Self {
        println!("creating party mode extension");
        let tokio_runtime = tokio::runtime::Runtime::new().expect("could not create tokio runtime for party mode extension");

        PartyModeExtension {
            server: config.get("server").and_then(|value| value.string()).unwrap_or_else(|| "wss://party.rustic.cloud".to_string()),
            runtime: Default::default(),
            background_bus: Default::default(),
            background_task: Default::default(),
            tokio_runtime,
        }
    }

    fn metadata() -> ExtensionMetadata {
        ExtensionMetadata {
            id: String::from("party-mode"),
            name: String::from("Party Mode"),
            version: crate_version!(),
        }
    }
}

impl Extension for PartyModeExtension {
    fn setup(&mut self, runtime: &ExtensionRuntime) -> Result<(), failure::Error> {
        println!("setup");
        self.runtime.replace(runtime.clone());
        Ok(())
    }
}

#[async_trait]
impl ExtensionApi for PartyModeExtension {
    async fn on_enable(&self) -> Result<(), failure::Error> {
        let server_url = self.server.clone();
        // We know this is set because of the lifecycle guarantees of the host
        let runtime = self.runtime.clone().unwrap();
        let server_code = Self::get_server_code(&runtime).await?;
        let (tx, rx) = tokio::sync::mpsc::channel(10);
        let handle = self.tokio_runtime.spawn(async move {
            let runner = PartyModeBackgroundRunner::new(runtime, rx, server_url, server_code).await?;

            runner.run().await?;

            Ok(())
        });
        self.background_bus.lock().await.replace(tx);

        let mut task = self.background_task.lock().await;
        *task = Some(handle);

        Ok(())
    }

    async fn on_disable(&self) -> Result<(), failure::Error> {
        let mut task = self.background_task.lock().await;
        task.take();

        Ok(())
    }

    async fn get_controls(&self) -> Result<ExtensionControls, Error> {
        let runtime = self.runtime.as_ref().unwrap();
        let server_code = runtime.read_metadata(SERVER_CODE_STORAGE_TOKEN).await?.and_then(|value| value.string());
        let join_url = server_code.map(|code| format!("{}/join?code={}", &self.server, code));

        Ok(ExtensionControls {
            actions: vec![(REFRESH_SERVER_CODE, "Refresh Server Code").into()],
            infos: join_url.into_iter().map(|url| ExtensionInfo::Link(url)).collect(),
        })
    }


    async fn on_add_to_queue(&self, tracks: Vec<Track>) -> Result<Vec<Track>, failure::Error> {
        let mut bus = self.background_bus.lock().await;
        if let Some(bus) = bus.as_mut() {
            bus.send(PlayerEvent::QueueUpdated).await?;
        }

        Ok(tracks)
    }
}

impl PartyModeExtension {
    pub async fn get_server_code(runtime: &ExtensionRuntime) -> Result<String, failure::Error> {
        let id = if let Some(MetaValue::String(code)) = runtime.read_metadata(SERVER_CODE_STORAGE_TOKEN).await? {
            code
        }else {
            let mut rng = SmallRng::from_entropy();
            let id = std::iter::repeat(())
                .map(|()| rng.sample(Alphanumeric))
                .map(char::from)
                .take(5)
                .collect::<String>();
            runtime.write_metadata(SERVER_CODE_STORAGE_TOKEN, id.clone().into()).await?;
            id
        };
        Ok(id)
    }
}

host_extension!(PartyModeExtension);
