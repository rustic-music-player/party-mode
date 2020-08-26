using System.Threading.Tasks;
using Rustic.PartyMode.Proxy.Messaging.Contracts.Commands;
using Rustic.PartyMode.Proxy.Messaging.Contracts.Queries;

namespace Rustic.PartyMode.Proxy.Messaging.Contracts
{
    public interface IExecutor
    {
        public Task<TResult> Query<TQuery, TResult>(TQuery query) where TQuery : class, IQuery<TResult> where TResult : class;

        public Task Send<TCommand>(TCommand command) where TCommand : class, ICommand;
    }
}