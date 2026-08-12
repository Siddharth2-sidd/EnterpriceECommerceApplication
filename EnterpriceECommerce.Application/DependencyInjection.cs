using EnterpriceECommerce.Application.Interfaces;
using EnterpriceECommerce.Application.Mappings;
using EnterpriceECommerce.Application.Services;
using EnterpriceECommerce.Application.Validators;
using EnterpriceECommerce.Application.Validators.BrandValidator;
using EnterpriceECommerce.Application.Validators.Product;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;


namespace EnterpriceECommerce.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services) {
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<IBrandService, BrandService>();
            services.AddScoped<IProductServices, ProductService>();
            services.AddScoped<IProductImageService, ProductImageService>();

            services.AddValidatorsFromAssemblyContaining<RegisterValidator>();
            services.AddValidatorsFromAssemblyContaining<CreateCategoryValidator>();
            services.AddValidatorsFromAssemblyContaining<UpdateCategoryValidator>();
            services.AddValidatorsFromAssemblyContaining<CreateBrandValidator>();
            services.AddValidatorsFromAssemblyContaining<UpdateBrandValidator>();
            services.AddValidatorsFromAssemblyContaining<CreateProductValidator>();
            services.AddValidatorsFromAssemblyContaining<UpdateProductValidator>();

            services.AddAutoMapper(typeof(CategoryProfile));
            services.AddAutoMapper(typeof(BrandProfile));
            services.AddAutoMapper(typeof(ProductProfile));

            return services;
        }
    }
}
