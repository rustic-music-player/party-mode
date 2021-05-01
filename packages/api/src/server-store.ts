import { Injectable } from '@nestjs/common';
import { TrackModel } from './tracks/track.model';

class ServerState {
  current: TrackModel;
  queue: TrackModel[];
}

@Injectable()
export class ServerStore {
  private servers = new Map<string, ServerState>();

  async put(serverId: string) {
    this.servers.set(serverId, new ServerState());
  }

  async remove(serverId: string) {
   this.servers.delete(serverId);
  }

  async getState(serverId: string): Promise<ServerState> {
    return this.servers.get(serverId);
  }
}
