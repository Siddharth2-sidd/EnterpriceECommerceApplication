using EnterpriceECommerce.Application.Interfaces;
using EnterpriseECommerce.Infrastructure.Identity;
using EnterpriceECommerce.Domain.Comman;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace EnterpriceECommerce.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(IServiceCollection services,IConfiguration configuration)
        {
            services.Configure<JwtSettings>(configuration.GetSection("JwtSettings"));

            services.AddScoped<IJwtTokenGenrator, JwtTokenGenerator>();

            return services;
        }
    }
}
