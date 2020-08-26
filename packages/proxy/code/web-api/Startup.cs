using System;
using System.Net.WebSockets;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Rustic.PartyMode.Proxy.Application;
using Rustic.PartyMode.Proxy.Infrastructure;
using Rustic.PartyMode.Proxy.Messaging;
using Rustic.PartyMode.Proxy.WebApi.Socket;

namespace Rustic.PartyMode.Proxy.WebApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddApplication();
            services.AddInfrastructure();
            services.AddMassTransitMessaging();
            services.AddScoped<WebSocketHandler>();
            services.AddScoped<WebSocketMiddleware>();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, WebSocketMiddleware socketMiddleware)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            app.UseAuthorization();

            app.UseWebSockets();

            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });

            app.Use(socketMiddleware.Invoke);
        }
    }
}
