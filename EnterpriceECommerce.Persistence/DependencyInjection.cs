
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
            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
            services.AddScoped<IUserRepository, UserRepository>();  
            return services;
        }

    }
}
