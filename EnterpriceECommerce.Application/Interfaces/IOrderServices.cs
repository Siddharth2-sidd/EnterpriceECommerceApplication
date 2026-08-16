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
    }
}
