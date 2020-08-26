using System.Threading.Tasks;

namespace Rustic.PartyMode.Proxy.Domain.Services
{
    public interface IRusticLoader
    {
        public Task<Models.RusticApp> Load(string id);
    }
}