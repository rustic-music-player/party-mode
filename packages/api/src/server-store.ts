import { Injectable } from '@nestjs/common';
import { TrackModel } from './tracks/track.model';

class ServerState {
  current: TrackModel;
  queue: TrackModel[] = [];
}

@Injectable()
export class ServerStore {
  private servers = new Map<string, ServerState>();

  async put(serverId: string): Promise<void> {
    this.servers.set(serverId, new ServerState());
  }

  async remove(serverId: string): Promise<void> {
   this.servers.delete(serverId);
  }

  async getState(serverId: string): Promise<ServerState> {
    return this.servers.get(serverId);
  }

  async update(serverId: string, state: ServerState): Promise<void> {
    this.servers.set(serverId, state);
  }
}
