using EnterpriceECommerce.Domain.Entitites;

namespace EnterpriceECommerce.Persistence.Repositories.Interfaces
{
    public interface ICartRepository
    {
        Task<Cart?> GetByUserId(int userId);
        Task<Cart?> GetByIdAsync(int cartId);
        Task<CartItem?> GetCartItemAsync(int cartId, int productId);
        Task<CartItem?> GetCartItemByIdAsync(int cartItemId);
        Task AddAsync(Cart cart);
        Task AddItemAsync(CartItem cartItem);
        Task RemoveItemAsync(CartItem cartItem);
        Task SaveChangesAsync();

     }
}
