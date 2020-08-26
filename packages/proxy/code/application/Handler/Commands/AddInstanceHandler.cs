using System.Threading.Tasks;
using Rustic.PartyMode.Proxy.Application.Contracts.Commands;
using Rustic.PartyMode.Proxy.Domain.Services;
using Rustic.PartyMode.Proxy.Messaging.Contracts.Commands;

namespace Rustic.PartyMode.Proxy.Application.Handler.Commands
{
    public class AddInstanceHandler : ICommandHandler<AddInstance>
    {
        private readonly IRusticCreator creator;

        public AddInstanceHandler(IRusticCreator creator)
        {
            this.creator = creator;
        }
        
        public Task Handle(AddInstance query)
        {
            return creator.Add(query.Rustic);
        }
    }
}