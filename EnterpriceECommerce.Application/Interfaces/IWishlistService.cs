using EnterpriceECommerce.Application.DTOs.WishListItem;


namespace EnterpriceECommerce.Application.Interfaces
{
    public interface IWishlistService
    {
        Task<WishlistItemResponseDto> AddAsync( int userId,int productId);
        Task<List<WishlistItemResponseDto>> GetMyWishlistAsync(int userId);
        Task RemoveAsync(int userId, int productId);
        Task<bool> IsInWishlistAsync(int userId,int productId);
    }
}
