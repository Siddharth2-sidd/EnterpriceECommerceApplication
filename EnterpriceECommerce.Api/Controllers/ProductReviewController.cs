using EnterpriceECommerce.Application.DTOs.Review;
using EnterpriceECommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EnterpriceECommerce.Api.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class ProductReviewController : Controller
    {
        private readonly IProductReviewServices _productReviewServices;
        public ProductReviewController(IProductReviewServices productReviewServices)
        {
            _productReviewServices = productReviewServices;
        }
        private int GetUserId()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userId, out var id))
                throw new UnauthorizedAccessException();

            return id;
        }
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create(CreateReviewDto request)
        {
            var userId = GetUserId();
            var result = await _productReviewServices.CreateAsync(userId, request);

            return Ok(result);
        }

        [HttpGet("product/{productId}")]
        public async Task<IActionResult> GetByProduct(int productId)
        {
            var result = await _productReviewServices.GetByProductAsync(productId);

            return Ok(result);
        }

        [HttpGet("product/{productId}/rating")]
        public async Task<IActionResult> GetRating(int productId)
        {
            var result = await _productReviewServices.GetRatingAsync(productId);

            return Ok(result);
        }

        [Authorize]
        [HttpPut("{reviewId}")]
        public async Task<IActionResult> Update(int reviewId, UpdateReviewDto request)
        {
            var userId = GetUserId();
            var result = await _productReviewServices.UpdateAsync(userId, reviewId, request);

            return Ok(result);
        }

        [Authorize]
        [HttpDelete("{reviewId}")]
        public async Task<IActionResult> Delete(int reviewId)
        {
            var userId = GetUserId();
            await _productReviewServices.DeleteAsync(userId, reviewId);

            return Ok(new
            {
                Message = "Review deleted successfully."
            });
        }
    }
}
