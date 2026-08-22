
using EnterpriceECommerce.Application.DTOs.Review;

namespace EnterpriceECommerce.Application.Interfaces
{
    public interface IProductReviewServices
    {
        Task<ReviewResponseDto> CreateAsync(int userId,CreateReviewDto request);
        Task<ReviewResponseDto> UpdateAsync(int userId, int reviewId, UpdateReviewDto request);
        Task<List<ReviewResponseDto>> GetByProductAsync(int productId);
        Task<ProductRatingDto> GetRatingAsync(int productId);
        Task DeleteAsync(int userId,int reviewId);
    }
}
