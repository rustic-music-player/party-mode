using System;
using System.Linq;
using MassTransit;
using Microsoft.Extensions.DependencyInjection;
using Rustic.PartyMode.Proxy.Messaging.Contracts;

namespace Rustic.PartyMode.Proxy.Messaging
{
    public static class DependencyInjection
    {
        public static void AddMassTransitMessaging(this IServiceCollection services)
        {
            services.AddScoped<IExecutor, MassTransitExecutor>();
            ServiceProvider serviceProvider = services.BuildServiceProvider();
            services.AddMediator(cfg =>
            {
                Type[] subscribers = serviceProvider.GetServices<ISubscriber>().Select(service => service.GetType()).ToArray();
                cfg.AddConsumers(subscribers);
            });
        }
        
        public static void AddMessaging(this IServiceCollection services)
        {
            services.AddScoped<IExecutor, InternalExecutor>();
        }
    }
}