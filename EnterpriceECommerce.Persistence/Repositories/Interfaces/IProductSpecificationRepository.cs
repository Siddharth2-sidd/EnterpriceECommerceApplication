using EnterpriceECommerce.Domain.Entitites;

namespace EnterpriceECommerce.Persistence.Repositories.Interfaces;

public interface IProductSpecificationRepository
{
    Task AddAsync(ProductSpecification specification);

    Task<ProductSpecification?> GetByIdAsync(int id);

    Task<List<ProductSpecification>> GetByProductIdAsync(
        int productId);

    Task UpdateAsync(ProductSpecification specification);

    Task DeleteAsync(ProductSpecification specification);

    Task SaveChangesAsync();
}