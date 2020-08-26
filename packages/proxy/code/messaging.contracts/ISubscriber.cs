using MassTransit;

namespace Rustic.PartyMode.Proxy.Messaging.Contracts
{
    public interface ISubscriber<TMessage> : ISubscriber, IConsumer<TMessage> where TMessage : class
    {
    }

    public interface ISubscriber
    {
    }
}