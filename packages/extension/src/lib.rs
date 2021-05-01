use std::collections::HashMap;

use async_trait::async_trait;

use rustic_core::Track;
use rustic_extension_api::*;

use tokio::sync::Mutex;
use tokio::task::JoinHandle;
use crate::background_task::{PartyModeBackgroundRunner, PlayerEvent};

mod background_task;

#[derive(Debug)]
pub struct PartyModeExtension {
    server: Option<String>,
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
            server: config.get("server").and_then(|value| value.string()),
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
        if let Some(server_url) = self.server.clone() {
            let (tx, rx) = tokio::sync::mpsc::channel(10);
            // We know this is set because of the lifecycle guarantees of the host
            let runtime = self.runtime.clone().unwrap();
            let handle = self.tokio_runtime.spawn(async move {
                let runner = PartyModeBackgroundRunner::new(runtime, rx, server_url).await?;

                runner.run().await?;

                Ok(())
            });

            let mut task = self.background_task.lock().await;
            *task = Some(handle);

            Ok(())
        }else {
            failure::bail!("Missing server url")
        }
    }

    async fn on_disable(&self) -> Result<(), failure::Error> {
        let mut task = self.background_task.lock().await;
        task.take();

        Ok(())
    }

    async fn on_add_to_queue(&self, tracks: Vec<Track>) -> Result<Vec<Track>, failure::Error> {
        let mut bus = self.background_bus.lock().await;
        if let Some(bus) = bus.as_mut() {
            bus.send(PlayerEvent::QueueUpdated).await?;
        }

        Ok(tracks)
    }
}

host_extension!(PartyModeExtension);
