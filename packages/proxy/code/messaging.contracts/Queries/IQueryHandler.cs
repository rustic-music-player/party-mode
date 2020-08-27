using System.Threading.Tasks;
using MassTransit;

namespace Rustic.PartyMode.Proxy.Messaging.Contracts.Queries
{
    public abstract class IQueryHandler<TQuery, TResult> : ISubscriber<TQuery> where TQuery : class, IQuery<TResult>
    {
        public abstract Task<TResult> Handle(TQuery query);

        async Task IConsumer<TQuery>.Consume(ConsumeContext<TQuery> context)
        {
            TResult result = await Handle(context.Message);
            await context.RespondAsync(result);
        }
    }
}