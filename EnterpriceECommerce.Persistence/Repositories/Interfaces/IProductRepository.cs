using EnterpriceECommerce.Domain.Comman;
using EnterpriceECommerce.Domain.Entitites;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterpriceECommerce.Persistence.Repositories.Interfaces
{
    public interface IProductRepository
    {
        Task AddAsync(Product product);

        Task<List<Product>> GetAllAsync(ProductFilterDTO filter);
        Task<Product?> GetByIdAsync(int id);
        Task<bool> ExitsBySKUAsync(string sku);
        Task<bool> CategoryExitsAsync(int categoryId);
        Task<bool> BrandExitsAsync(int brandId);
        Task Update(Product product);
        Task Delete(Product product);
        Task SaveChangesAsync();
    }
}
