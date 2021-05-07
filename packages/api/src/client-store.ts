import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientStore {
  // map clientId to serverId
  private clients = new Map<string, string>();
  // map serverId to clientIds
  private servers = new Map<string, string[]>();

  async joinServer(clientId: string, serverId: string): Promise<void> {
    this.clients.set(clientId, serverId);
    const clients = this.servers.get(serverId) ?? [];
    clients.push(clientId);
    this.servers.set(serverId, clients);
  }

  async disconnectClient(clientId: string): Promise<void> {
    const serverId = this.clients.get(clientId);
    this.clients.delete(clientId);
    if (!serverId) {
      const clients = this.servers.get(serverId);
      const next = clients.filter(c => c != clientId);
      this.servers.set(serverId, next);
    }
  }

  async getClientsConnectedToServer(serverId: string): Promise<string[]> {
    return this.servers.get(serverId) ?? [];
  }
}
