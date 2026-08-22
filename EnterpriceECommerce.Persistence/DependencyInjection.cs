
using EnterpriceECommerce.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using EnterpriceECommerce.Persistence.Repositories.Implementations;
using EnterpriceECommerce.Persistence.Repositories.Interfaces;


namespace EnterpriceECommerce.Persistence
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddPersistence(
            this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<AppDbContext>(options =>options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
            services.AddScoped<IResetPasswordRepository, ResetPasswordRepository>();
            services.AddScoped<IEmailVerificationRepository, EmailVerificationRepository>();
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<IBrandRepository, BrandRepository>();
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<IProductImagesRepository, ProductImagesRepository>();
            services.AddScoped<IProductSpecificationRepository,ProductSpecificationRepository>();
            services.AddScoped<IInventoryRepository, InventoryRepository>();
            services.AddScoped<ICartRepository, CartRepository>();
            services.AddScoped<IOrderRepository, OrderRepository>();
            services.AddScoped<IPaymentRepository, PaymentRepository>();
            services.AddScoped<IAddressRepository, AddressRepository>();
            services.AddScoped<IProductReviewRepository, ProductReviewRepository>();
            services.AddScoped<IWishlistRepository, WishlistRepository>();
            services.AddScoped<IRefundRepository, RefundRepository>();

            return services;
        }
    }
}
