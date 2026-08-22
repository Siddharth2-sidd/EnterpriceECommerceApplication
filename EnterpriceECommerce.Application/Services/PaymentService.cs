using EnterpriceECommerce.Application.DTOs.Payment;
using EnterpriceECommerce.Application.Interfaces;
using EnterpriceECommerce.Domain.Entitites;
using EnterpriceECommerce.Persistence.Repositories.Interfaces;

namespace EnterpriceECommerce.Application.Services;

public class PaymentService : IPaymentService
{
    private readonly IPaymentRepository _paymentRepository;
    private readonly IOrderRepository _orderRepository;

    public PaymentService(IPaymentRepository paymentRepository,IOrderRepository orderRepository)
    {
        _paymentRepository = paymentRepository;
        _orderRepository = orderRepository;
    }

    public async Task<PaymentResponseDto> CreatePaymentAsync(int userId,CreatePaymentRequestDto request)
    {
        var order = await _orderRepository.GetByIdAsync(request.OrderId);

        if (order == null)
            throw new Exception("Order not found.");

        if (order.UserId != userId)
            throw new UnauthorizedAccessException();

        var existingPayment =  await _paymentRepository.GetByOrderIdAsync(request.OrderId);

        if (existingPayment != null)
        {
            return MapPayment(existingPayment);
        }

        if (request.PaymentMethod != "COD")
        {
            throw new Exception("Currently only COD payment is supported.");
        }

        var payment = new Payment
        {
            OrderId = order.Id,
            TransactionId = GenerateTransactionId(),
            Amount = order.TotalAmount,
            PaymentMethod = request.PaymentMethod,
            PaymentStatus = "Pending"
        };

        await _paymentRepository.AddAsync(payment);

        await _paymentRepository.SaveChangesAsync();

        return MapPayment(payment);
    }

    public async Task<PaymentResponseDto>GetPaymentByOrderIdAsync(int userId,int orderId)
    {
        var order = await _orderRepository.GetByIdAsync(orderId);

        if (order == null)
            throw new Exception("Order not found.");

        if (order.UserId != userId)
            throw new UnauthorizedAccessException();

        var payment = await _paymentRepository .GetByOrderIdAsync(orderId);

        if (payment == null)
            throw new Exception("Payment not found.");

        return MapPayment(payment);
    }

    private static string GenerateTransactionId()
    {
        return $"TXN-{Guid.NewGuid():N}";
    }

    private static PaymentResponseDto MapPayment(Payment payment)
    {
        return new PaymentResponseDto
        {
            Id = payment.Id,
            OrderId = payment.OrderId,
            TransactionId = payment.TransactionId,
            Amount =  payment.Amount,
            PaymentMethod =  payment.PaymentMethod,
            PaymentStatus = payment.PaymentStatus,
            CreatedDate =  payment.CreatedDate,
            PaidDate = payment.PaidDate
        };
    }
}