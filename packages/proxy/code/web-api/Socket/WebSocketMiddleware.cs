using System;
using System.Net.WebSockets;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace Rustic.PartyMode.Proxy.WebApi.Socket
{
    public class WebSocketMiddleware
    {
        public async Task Invoke(HttpContext context, Func<Task> next)
        {
            if (context.Request.Path == "/api/socket")
            {
                if (context.WebSockets.IsWebSocketRequest)
                {
                    WebSocket socket = await context.WebSockets.AcceptWebSocketAsync();
                    WebSocketHandler handler = context.RequestServices.GetService<WebSocketHandler>();
                    await handler.Handle(socket);
                }
                else
                {
                    context.Response.StatusCode = 400;
                }
            }
            else
            {
                await next();
            }
        }
    }
}