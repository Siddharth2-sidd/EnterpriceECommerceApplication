using EnterpriceECommerce.Application.DTOs.Cart;

namespace EnterpriceECommerce.Application.Interfaces
{
    public interface ICartService
    {
        Task<CartResponseDTO> GetCartAsync(int userId);
        Task AddToCartAsync(int userId, AddToCartResquestDTO request);
        Task UpdateItemAsync(int userId, UpdateCartItemResquetDTO request);
        Task RemoveItemAsync(int userId, int cartItemId);
        Task ClearCartAsync(int userId);
    }
}
