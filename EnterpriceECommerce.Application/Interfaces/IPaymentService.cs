using EnterpriceECommerce.Application.DTOs.Payment;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterpriceECommerce.Application.Interfaces
{
    public interface IPaymentService
    {
        Task<PaymentResponseDto> CreatePaymentAsync(int userId,CreatePaymentRequestDto request);
        Task<PaymentResponseDto> GetPaymentByOrderIdAsync(int userId,int orderId);
    }
}
