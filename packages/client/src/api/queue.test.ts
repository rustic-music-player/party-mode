import { QueueApi } from './queue';
import { SocketApi } from './socket';
import { IMock, Mock } from 'proxy-mocks/sinon';

describe('Queue Api', () => {
  let socket: IMock<SocketApi>;

  let api: QueueApi;

  beforeEach(() => {
    socket = Mock.of(SocketApi);

    api = new QueueApi(socket)
  });

  test.each([
    ['song url'],
    ['another song url']
  ])('upvote should send upvote command (%s)', (url: string) => {
    api.upvote(url);

    expect(socket.emit).toHaveBeenCalledWith({
      type: 'client/command/upvote',
      song: url,
    })
  })
});
