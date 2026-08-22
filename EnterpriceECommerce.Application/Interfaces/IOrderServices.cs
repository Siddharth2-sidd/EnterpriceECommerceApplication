using EnterpriceECommerce.Application.DTOs.Order;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterpriceECommerce.Application.Interfaces
{
    public interface IOrderServices
    {
        Task<OrderResponseDto> CheckOutAsync(CheckoutRequestDto request, int userId);
        Task<OrderResponseDto> GetByIdAsync(int userId, int orderId);
        Task<List<OrderResponseDto>> GetMyOrdersAsync(int userId);
        Task<List<OrderResponseDto>> GetAllOrdersAsync(OrderFilterDto filter);
        Task UpdateOrderStatusAsync(int orderId,string status);
        Task UpdatePaymentStatusAsync(int orderId,string paymentStatus);
        Task CancelOrderAsync(int orderId);
        Task CancelAsync(int userId,int orderId,string reason);
    }
}
