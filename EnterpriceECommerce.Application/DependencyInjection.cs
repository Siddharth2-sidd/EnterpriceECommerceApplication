using EnterpriceECommerce.Application.Interfaces;
using EnterpriceECommerce.Application.Mappings;
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
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddValidatorsFromAssemblyContaining<RegisterValidator>();
            services.AddValidatorsFromAssemblyContaining<CreateCategoryValidator>();
            services.AddValidatorsFromAssemblyContaining<UpdateCategoryValidator>();
            services.AddAutoMapper(typeof(CategoryProfile));
            services.AddAutoMapper(typeof(BrandProfile));

            return services;
        }
    }
}
