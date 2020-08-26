namespace Rustic.PartyMode.Proxy.WebApi.Socket
{
    public class WebSocketMessage<TPayload>
    {
        public string Type { get; set; }

        public TPayload Payload { get; set; }
    }

    public class WebSocketMessage
    {
        public string Type { get; set; }

        public dynamic Payload { get; set; }
    }
}