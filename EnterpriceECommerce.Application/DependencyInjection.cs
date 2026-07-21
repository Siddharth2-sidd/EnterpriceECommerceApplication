using EnterpriceECommerce.Application.Interfaces;
using EnterpriceECommerce.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace EnterpriceECommerce.Application
{
    public class DependencyInjection
    {
        public IServiceCollection AddApplication(IServiceCollection services) {
            services.AddScoped<IAuthService, AuthService>();
            return services;
        }
    }
}
