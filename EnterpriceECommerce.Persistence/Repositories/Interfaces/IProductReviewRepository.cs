using EnterpriceECommerce.Domain.Entitites;

namespace EnterpriceECommerce.Persistence.Repositories.Interfaces
{
    public interface IProductReviewRepository
    {
        Task AddAsync(ProductReview review);
        Task<ProductReview?> GetByIdAsync(int id);
        Task<ProductReview?> GetByUserAndProductAsync(int userId,int productId);
        Task<List<ProductReview>> GetByProductIdAsync(int productId);
        Task DeleteAsync(ProductReview review);
        Task SaveChangesAsync();
    }
}
