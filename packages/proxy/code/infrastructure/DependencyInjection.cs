using Microsoft.Extensions.DependencyInjection;
using Rustic.PartyMode.Proxy.Domain.Services;

namespace Rustic.PartyMode.Proxy.Infrastructure
{
    public static class DependencyInjection
    {
        public static void AddInfrastructure(this IServiceCollection services)
        {
            services.AddSingleton<RusticStore>();
            services.AddScoped<IRusticLoader>(provider => provider.GetService<RusticStore>());
            services.AddScoped<IRusticCreator>(provider => provider.GetService<RusticStore>());
        }
    }
}