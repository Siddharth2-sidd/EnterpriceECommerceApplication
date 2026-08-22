
using EnterpriceECommerce.Application.DTOs.Review;
using EnterpriceECommerce.Application.Interfaces;
using EnterpriceECommerce.Domain.Entitites;
using EnterpriceECommerce.Persistence.Repositories.Interfaces;

namespace EnterpriceECommerce.Application.Services
{
    public class ProductReviewServices : IProductReviewServices
    {
        private readonly IProductReviewRepository _repository;
        private readonly IProductRepository _productRepository;

        public ProductReviewServices(IProductReviewRepository repository,IProductRepository productRepository)
        {
            _repository = repository;
            _productRepository = productRepository;
        }

        public async Task<ReviewResponseDto> CreateAsync(int userId,CreateReviewDto request)
        {
            if (request.Rating < 1 || request.Rating > 5)
            {
                throw new Exception("Rating must be between 1 and 5.");
            }

            if (string.IsNullOrWhiteSpace(request.Comment))
            {
                throw new Exception("Comment is required.");
            }

            var product = await _productRepository.GetByIdAsync(request.ProductId);

            if (product == null)
            {
                throw new Exception("Product not found.");
            }

            var existing =  await _repository.GetByUserAndProductAsync(userId,request.ProductId);
            if (existing != null)
            {
                throw new Exception("You have already reviewed this product.");
            }

            var review = new ProductReview
            {
                ProductId = request.ProductId,
                UserId = userId,
                Rating = request.Rating,
                Comment = request.Comment,
                IsApproved = true
            };

            await _repository.AddAsync(review);
            await _repository.SaveChangesAsync();
            var saved =  await _repository.GetByIdAsync(review.Id);

            return Map(saved!);
        }

        public async Task<ReviewResponseDto> UpdateAsync(int userId,int reviewId,UpdateReviewDto request)
        {
            if (request.Rating < 1 || request.Rating > 5)
            {
                throw new Exception("Rating must be between 1 and 5.");
            }

            var review =  await _repository.GetByIdAsync(reviewId);
            if (review == null)
            {
                throw new Exception("Review not found.");
            }

            if (review.UserId != userId)
            {
                throw new UnauthorizedAccessException();
            }

            review.Rating = request.Rating;
            review.Comment = request.Comment;
            review.UpdatedOn = DateTime.UtcNow;

            await _repository.SaveChangesAsync();
            return Map(review);
        }

        public async Task<List<ReviewResponseDto>>GetByProductAsync(int productId)
        {
            var reviews = await _repository.GetByProductIdAsync(productId);

            return reviews.Select(Map).ToList();
        }

        public async Task<ProductRatingDto>GetRatingAsync(int productId)
        {
            var reviews = await _repository.GetByProductIdAsync(productId);

            return new ProductRatingDto
            {
                ProductId = productId,
                AverageRating = reviews.Any()? Math.Round(reviews.Average(x => x.Rating),2): 0,
                TotalReviews = reviews.Count
            };
        }

        public async Task DeleteAsync(int userId,int reviewId)
        {
            var review = await _repository.GetByIdAsync(reviewId);

            if (review == null)
            {
                throw new Exception("Review not found.");
            }

            if (review.UserId != userId)
            {
                throw new UnauthorizedAccessException();
            }

            await _repository.DeleteAsync(review);
            await _repository.SaveChangesAsync();
        }

        private static ReviewResponseDto Map(ProductReview review)
        {
            return new ReviewResponseDto
            {
                Id = review.Id,
                ProductId = review.ProductId,
                UserId = review.UserId,
                UserName = ($"{review.User?.FirstName ?? ""} {review.User?.LastName ?? ""}").Trim(),
                Rating =  review.Rating,
                Comment =  review.Comment,
                CreatedOn = review.CreatedOn
            };
        }
    }
}
