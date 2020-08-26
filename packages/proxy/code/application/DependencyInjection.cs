using Microsoft.Extensions.DependencyInjection;
using Rustic.PartyMode.Proxy.Application.Handler.Commands;
using Rustic.PartyMode.Proxy.Application.Handler.Queries;
using Rustic.PartyMode.Proxy.Messaging.Contracts;

namespace Rustic.PartyMode.Proxy.Application
{
    public static class DependencyInjection
    {
        public static void AddApplication(this IServiceCollection services)
        {
            services.AddScoped<ISubscriber, GetInstanceHandler>();
            services.AddScoped<ISubscriber, AddInstanceHandler>();
        }
    }
}