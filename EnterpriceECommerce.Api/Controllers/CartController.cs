using EnterpriceECommerce.Application.DTOs.Cart;
using EnterpriceECommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EnterpriceECommerce.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : Controller
    {
        private ICartService _cartServices;
        public CartController(ICartService services)
        {
            _cartServices = services;
        }
        private int GetUserId() 
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userId, out var id))
                throw new UnauthorizedAccessException();
            return id;
        }
        [HttpGet]
        public async Task<IActionResult> GetCart() 
        {
            var userId = GetUserId();
            var cart = await _cartServices.GetCartAsync(userId);
            return Ok(cart);
        }
        [HttpPost("addItems")]
        public async Task<IActionResult> AddAsync(AddToCartResquestDTO request)
        {
            var userId = GetUserId();
            await _cartServices.AddToCartAsync(userId,request);
            return Ok(new
            {
                Message = "Product Added To Cart"
            });
        }
        [HttpPut("updateItems")]
        public async Task<IActionResult> UpdateAsync(UpdateCartItemResquetDTO request)
        {
            var userId = GetUserId();
            await _cartServices.UpdateItemAsync(userId, request);
            return Ok(new
            {
                message = "cart item updated"
            });
        }
        [HttpDelete("items/{cartItemId}")]
        public async Task<IActionResult> DeleteAsync(int cartItemId)
        {
            var userId = GetUserId();
            await _cartServices.RemoveItemAsync(userId, cartItemId);
            return Ok(new
            {
                message = "cart item Deleted"
            });
        }
        [HttpDelete]
        public async Task<IActionResult> ClearCart()
        {
            var userId = GetUserId();

            await _cartServices.ClearCartAsync(userId);

            return Ok(new
            {
                Message = "Cart cleared."
            });
        }

    }
}
