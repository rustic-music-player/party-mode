using System;
using System.Net.WebSockets;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using MassTransit.Mediator;

namespace Rustic.PartyMode.Proxy.WebApi.Socket
{
    public class WebSocketHandler
    {
        private readonly IMediator mediator;

        public WebSocketHandler(IMediator mediator)
        {
            this.mediator = mediator;
        }

        public async Task Handle(WebSocket socket)
        {
            byte[] buffer = new byte[1024 * 4];
            while (socket.State == WebSocketState.Open)
            {
                WebSocketReceiveResult result =
                    await socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                if (!result.CloseStatus.HasValue)
                {
                    ArraySegment<byte> incoming = new ArraySegment<byte>(buffer, 0, result.Count);
                    WebSocketMessage msg = JsonSerializer.Deserialize<WebSocketMessage>(incoming,
                        new JsonSerializerOptions
                        {
                            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                        });
                    Console.WriteLine($"{msg.Type} {msg.Payload}");
                    
                }
            }
        }

        private async Task Handle(WebSocketMessage msg)
        {
            // TODO: convert to bus messages
        }
    }
}