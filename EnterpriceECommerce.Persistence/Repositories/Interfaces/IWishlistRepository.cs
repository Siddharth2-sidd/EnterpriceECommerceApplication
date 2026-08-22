using EnterpriceECommerce.Domain.Entitites;

namespace EnterpriceECommerce.Persistence.Repositories.Interfaces
{
    public interface IWishlistRepository
    {
        Task AddAsync(WishListItem item);
        Task<WishListItem?> GetByIdAsync(int id);
        Task<WishListItem?> GetByUserAndProductAsync(int userId,int productId);
        Task<List<WishListItem>> GetByUserIdAsync(int userId);
        Task DeleteAsync(WishListItem item);
        Task SaveChangesAsync();
    }
}
