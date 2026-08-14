using EnterpriceECommerce.Application.Interfaces;
using EnterpriseECommerce.Infrastructure.Identity;
using EnterpriceECommerce.Domain.Comman;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using EnterpriceECommerce.Infrastructure.Identity;
using EnterpriceECommerce.Infrastructure.Email;
using EnterpriceECommerce.Infrastructure.Storage;

namespace EnterpriceECommerce.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<JwtSettings>(configuration.GetSection("JwtSettings"));

            services.AddScoped<IJwtTokenGenrator, JwtTokenGenerator>();
            services.AddScoped<IRefreshTokenGenerator, RefreshTokenGenerator>();
            services.AddScoped<IEmailServices, EmailServices>();
            services.AddScoped<IBlobStorageService, BlobStorageService>();

            return services;
        }
    }
}
