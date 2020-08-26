using System.Collections.Concurrent;
using System.Threading.Tasks;
using Rustic.PartyMode.Proxy.Domain.Exceptions;
using Rustic.PartyMode.Proxy.Domain.Models;
using Rustic.PartyMode.Proxy.Domain.Services;

namespace Rustic.PartyMode.Proxy.Infrastructure
{
    public class RusticStore : IRusticLoader, IRusticCreator
    {
        private readonly ConcurrentDictionary<string, RusticApp> instances =
            new ConcurrentDictionary<string, RusticApp>();

        public async Task Add(RusticApp rustic)
        {
            instances.TryAdd(rustic.Id, rustic);
        }

        public async Task<RusticApp> Load(string id)
        {
            if (instances.TryGetValue(id, out RusticApp rustic))
            {
                return rustic;
            }
            throw new NotFoundException();
        }
    }
}