using System.Threading.Tasks;
using MassTransit;
using Rustic.PartyMode.Proxy.Application.contracts.Queries;
using Rustic.PartyMode.Proxy.Domain.Models;
using Rustic.PartyMode.Proxy.Domain.Services;
using Rustic.PartyMode.Proxy.Messaging.Contracts;
using Rustic.PartyMode.Proxy.Messaging.Contracts.Queries;

namespace Rustic.PartyMode.Proxy.Application.Handler.Queries
{
    public class GetInstanceHandler : IQueryHandler<GetInstance, RusticApp>
    {
        private readonly IRusticLoader rusticLoader;

        public GetInstanceHandler(IRusticLoader rusticLoader)
        {
            this.rusticLoader = rusticLoader;
        }

        public async Task<RusticApp> Handle(GetInstance query)
        {
            return await rusticLoader.Load(query.Id);
        }
    }
}