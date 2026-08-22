using EnterpriceECommerce.Application.DTOs.Order;
using EnterpriceECommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EnterpriceECommerce.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class OrderController : Controller
    {
        private readonly IOrderServices _orderServices;
        public OrderController(IOrderServices orderServices)
        {
            _orderServices = orderServices;
        }
        private int GetUserId()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if(!int.TryParse(userId, out var id))
            {
                throw new UnauthorizedAccessException();
            }
            return id;
        }
        [HttpPost("checkout")]
        public async Task<IActionResult> CheckOut(CheckoutRequestDto request)
        {
            var userId = GetUserId();
            var order = await _orderServices.CheckOutAsync(request, userId);
            return Ok(order);
        }
        [HttpGet]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = GetUserId();
            var order = await _orderServices.GetMyOrdersAsync(userId);
            return Ok(order);
        }
        [HttpGet("{orderId}")]
        public async Task<IActionResult> GetByOrderId(int orderId)
        {
            var userId = GetUserId();
            var order = await _orderServices.GetByIdAsync(userId, orderId);
            return Ok(order);
        }
    }
}
