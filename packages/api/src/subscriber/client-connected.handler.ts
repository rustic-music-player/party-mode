import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ClientConnectedEvent } from '../events/client-connected.event';
import { SocketSender } from '../sockets/socket-sender';

@EventsHandler(ClientConnectedEvent)
export class ClientConnectedHandler implements IEventHandler<ClientConnectedEvent> {
  constructor(private socketSender: SocketSender) {
  }

  handle(event: ClientConnectedEvent): any {
    this.socketSender.sendToClient(event.clientId, {
      type: 'client/event/now-playing',
      track: {
        url: '',
        title: 'Bassline Junkie (Bonus Track)',
        artist: 'Dizzee Rascal',
        album: 'The Fifth',
        coverUrl: 'https://lh3.googleusercontent.com/reXj4-TOmXRmFAqNI4zzG8gcAnAB40WLVPxWLPX24Vginp1np6DXFHEzsDzBfL31N9I0Y7UzHYnQQhxQ=w544-h544-l90-rj',
        thumbnailUrl: 'https://lh3.googleusercontent.com/reXj4-TOmXRmFAqNI4zzG8gcAnAB40WLVPxWLPX24Vginp1np6DXFHEzsDzBfL31N9I0Y7UzHYnQQhxQ=w544-h544-l90-rj',
        votes: 69,
        provider: 'youtube',
      }
    });
    this.socketSender.sendToClient(event.clientId, {
      type: 'client/event/queue',
      queue: []
    });
  }
}
