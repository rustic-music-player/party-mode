using System.Threading.Tasks;
using MassTransit;
using MassTransit.Mediator;
using Rustic.PartyMode.Proxy.Messaging.Contracts;
using Rustic.PartyMode.Proxy.Messaging.Contracts.Commands;
using Rustic.PartyMode.Proxy.Messaging.Contracts.Queries;

namespace Rustic.PartyMode.Proxy.Messaging
{
    public class MassTransitExecutor : IExecutor
    {
        private readonly IMediator mediator;

        public MassTransitExecutor(IMediator mediator)
        {
            this.mediator = mediator;
        }

        public async Task<TResult> Query<TQuery, TResult>(TQuery query) where TQuery : class, IQuery<TResult> where TResult : class
        {
            IRequestClient<TQuery> client = this.mediator.CreateRequestClient<TQuery>();

            Response<TResult> response = await client.GetResponse<TResult>(query);
            
            return response.Message;
        }

        public async Task Send<TCommand>(TCommand command) where TCommand : class, ICommand
        {
            await this.mediator.Send(command);
        }

    }
}