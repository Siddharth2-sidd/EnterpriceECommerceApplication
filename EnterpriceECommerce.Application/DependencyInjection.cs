using EnterpriceECommerce.Application.Interfaces;
using EnterpriceECommerce.Application.Services;
using EnterpriceECommerce.Application.Validators;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;


namespace EnterpriceECommerce.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services) {
            services.AddScoped<IAuthService, AuthService>();
            services.AddValidatorsFromAssemblyContaining<RegisterValidator>();
            return services;
        }
    }
}
