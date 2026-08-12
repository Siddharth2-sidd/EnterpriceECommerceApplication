using EnterpriceECommerce.Domain.Entitites;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterpriceECommerce.Persistence.Repositories.Interfaces
{
    public interface IProductImagesRepository
    {
        Task AddAsync(ProductImage image);

        Task<ProductImage?> GetByIdAsync(int id);

        Task<List<ProductImage>> GetByProductIdAsync(int productId);

        Task DeleteAsync(ProductImage image);

        Task SaveChangesAsync();
    }
}
