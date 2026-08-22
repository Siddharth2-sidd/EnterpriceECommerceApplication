using EnterpriceECommerce.Application.DTOs.Order;
using EnterpriceECommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace EnterpriceECommerce.Api.Controllers
{
    [Authorize(Roles ="Admin")]
    [Route("api/admin/orders")]
    [ApiController]
    public class AdminOrderController : Controller
    {
        private readonly IOrderServices _orderServices;
        public AdminOrderController(IOrderServices orderServices)
        {
            _orderServices = orderServices;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllOrders([FromQuery] OrderFilterDto filter)
        {
            var orders = await _orderServices.GetAllOrdersAsync(filter);
            return Ok(orders);
        }
        [HttpPut("{orderId}/status")]
        public async Task<IActionResult> UpdateStatus(int orderId, UpdateOrderStatusDto request)
        {
            await _orderServices.UpdateOrderStatusAsync(orderId, request.status);
            return Ok(new
            {
                Message = "Order status updated successfully"
            });
        }
        [HttpPut("{orderId}/payment-status")]
        public async Task<IActionResult> PaymentStatus(int orderId, UpdatePaymentStatusDto request)
        {
            await _orderServices.UpdatePaymentStatusAsync(orderId, request.PaymentStatus);
            return Ok(new
            {
                Message = "Payment status updated successfully"
            });
        }
        [HttpPut("{orderId}/cacel")]
        public async Task<IActionResult> CancelStatus(int orderId)
        {
            await _orderServices.CancelOrderAsync(orderId);
            return Ok(new
            {
                Message = "Payment status updated successfully"
            });
        }

    }
}
