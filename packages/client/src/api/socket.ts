import ReconnectingWebSocket from 'reconnecting-websocket';
import { Singleton } from '../commons/ioc-container';

export type SocketMessage = { type: string } & Record<string, unknown>;

@Singleton()
export class SocketApi {
  private socket: WebSocket = new ReconnectingWebSocket(`ws://${location.host}/api/client`)

  constructor() {
    this.socket.addEventListener('message', event => console.log('msg', event));
    this.socket.addEventListener('close', () => console.log('socket closed'));
  }

  emit(payload: SocketMessage) {
    this.socket.send(JSON.stringify(payload));
  }

  subscribe(type: string, callback: (msg: SocketMessage) => void) {
    this.socket.addEventListener('message', event => {
      const msg = JSON.parse(event.data);
      if (msg.type === type) {
        callback(msg);
      }
    });
  }
}
