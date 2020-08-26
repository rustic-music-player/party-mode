using System.Threading.Tasks;

namespace Rustic.PartyMode.Proxy.Domain.Services
{
    public interface IRusticCreator
    {
        public Task Add(Models.RusticApp rustic);
    }
}