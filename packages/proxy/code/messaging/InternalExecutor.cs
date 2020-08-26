using System;
using System.Diagnostics;
using System.Threading.Tasks;
using Rustic.PartyMode.Proxy.Messaging.Contracts;
using Rustic.PartyMode.Proxy.Messaging.Contracts.Commands;
using Rustic.PartyMode.Proxy.Messaging.Contracts.Queries;

namespace Rustic.PartyMode.Proxy.Messaging
{
    public class InternalExecutor : IExecutor
    {
        private readonly IServiceProvider serviceProvider;

        public InternalExecutor(IServiceProvider serviceProvider)
        {
            this.serviceProvider = serviceProvider;
        }

        public async Task<TResult> Query<TQuery, TResult>(TQuery query) where TQuery : class, IQuery<TResult> where TResult : class
        {
            IQueryHandler<TQuery, TResult> handler = GetHandler<IQueryHandler<TQuery, TResult>>();

            return await handler.Handle(query);
        }

        public async Task Send<TCommand>(TCommand command) where TCommand : class, ICommand
        {
            ICommandHandler<TCommand> handler = GetHandler<ICommandHandler<TCommand>>();

            await handler.Handle(command);
        }

        private THandler GetHandler<THandler>() where THandler : class
        {
            THandler handler = serviceProvider.GetService(typeof(THandler)) as THandler;

            Debug.Assert(handler != null, nameof(handler) + " != null");
            return handler;
        }
    }
}