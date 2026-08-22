using EnterpriceECommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EnterpriceECommerce.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class WishlistController : Controller
    {
        private readonly IWishlistService _wishlistService;
        public WishlistController(IWishlistService wishlistService)
        {
            _wishlistService = wishlistService;
        }
        private int GetUserId()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userId, out var id))
                throw new UnauthorizedAccessException();

            return id;
        }
        [HttpPost("{productId}")]
        public async Task<IActionResult> Create(int productId)
        {
            var userId = GetUserId();
            var result = await _wishlistService.AddAsync(userId, productId);

            return Ok(result);
        }
        [HttpGet]
        public async Task<IActionResult> GetMyWishlist()
        {
            var userId = GetUserId();

            var result =  await _wishlistService.GetMyWishlistAsync(userId);

            return Ok(result);
        }
        [HttpDelete("{productId}")]
        public async Task<IActionResult> Remove(int productId)
        {
            var userId = GetUserId();
            await _wishlistService.RemoveAsync(userId,productId);
            return Ok(new
            {
                Message ="Product removed from wishlist."
            });
        }
        [HttpGet("{productId}/exists")]
        public async Task<IActionResult> Exists(int productId)
        {
            var userId = GetUserId();
            var result = await _wishlistService.IsInWishlistAsync(userId,productId);

            return Ok(new
            {
                IsInWishlist = result
            });
        }

    }
}
