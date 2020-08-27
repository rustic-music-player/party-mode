using System.Threading.Tasks;
using MassTransit;

namespace Rustic.PartyMode.Proxy.Messaging.Contracts.Commands
{
    public abstract class ICommandHandler<TCommand> : ISubscriber<TCommand> where TCommand : class, ICommand
    {
        public abstract Task Handle(TCommand query);


        Task IConsumer<TCommand>.Consume(ConsumeContext<TCommand> context)
        {
            return Handle(context.Message);
        }
    }
}