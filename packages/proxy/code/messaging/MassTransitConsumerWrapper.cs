using System.Threading.Tasks;
using MassTransit;
using Rustic.PartyMode.Proxy.Messaging.Contracts;

namespace Rustic.PartyMode.Proxy.Messaging
{
    public class MassTransitConsumerWrapper<TMessage> : IConsumer<TMessage> where TMessage : class
    {
        private readonly ISubscriber subscriber;

        public MassTransitConsumerWrapper(ISubscriber subscriber)
        {
            this.subscriber = subscriber;
        }

        public Task Consume(ConsumeContext<TMessage> context)
        {
            
            throw new System.NotImplementedException();
        }
    }
}