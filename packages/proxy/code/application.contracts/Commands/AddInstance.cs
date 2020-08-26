using Rustic.PartyMode.Proxy.Domain.Models;
using Rustic.PartyMode.Proxy.Messaging.Contracts.Commands;

namespace Rustic.PartyMode.Proxy.Application.Contracts.Commands
{
    public class AddInstance : ICommand
    {
        public AddInstance(RusticApp rustic)
        {
            Rustic = rustic;
        }

        public RusticApp Rustic { get; }
    }
}