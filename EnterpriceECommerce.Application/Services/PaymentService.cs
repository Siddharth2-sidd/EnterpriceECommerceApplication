using EnterpriceECommerce.Application.DTOs.Payment;
using EnterpriceECommerce.Application.Interfaces;
using EnterpriceECommerce.Domain.Entitites;
using EnterpriceECommerce.Persistence.Repositories.Interfaces;

namespace EnterpriceECommerce.Application.Services;

public class PaymentService : IPaymentService
{
    private readonly IPaymentRepository _paymentRepository;
    private readonly IOrderRepository _orderRepository;
    private readonly IRefundRepository _refundRepository;

    public PaymentService(IPaymentRepository paymentRepository,IOrderRepository orderRepository, IRefundRepository refundRepository)
    {
        _paymentRepository = paymentRepository;
        _orderRepository = orderRepository;
        _refundRepository = refundRepository;
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
    public async Task<PaymentResponseDto> ProcessPaymentAsync(int userId, int paymentId)
    {
        var payment =  await _paymentRepository.GetByIdAsync(paymentId);
        if (payment == null)
        {
            throw new Exception("Payment not found.");
        }

        if (payment.Order.UserId != userId)
        {
            throw new UnauthorizedAccessException();
        }

        if (payment.PaymentStatus == "Paid")
        {
            return MapPayment(payment);
        }

        payment.PaymentStatus = "Paid";
        payment.PaidDate =  DateTime.UtcNow;
        payment.Order.PaymentStatus =  "Paid";

        await _paymentRepository.SaveChangesAsync();

        return MapPayment(payment);
    }
    public async Task<RefundResponseDto> RefundAsync(int userId, int paymentId,  string reason)
    {
        var payment = await _paymentRepository.GetByIdAsync(paymentId);

        if (payment == null)
        {
            throw new Exception("Payment not found.");
        }

        if (payment.Order.UserId != userId)
        {
            throw new UnauthorizedAccessException();
        }

        if (payment.PaymentStatus != "Paid")
        {
            throw new Exception("Only paid payments can be refunded.");
        }

        var existingRefund = await _refundRepository.GetByPaymentIdAsync(paymentId);

        if (existingRefund != null)
        {
            return MapRefund(existingRefund);
        }

        var refund = new Refund
        {
            PaymentId =  payment.Id,
            RefundTransactionId = $"REF-{DateTime.UtcNow:yyyyMMddHHmmssfff}",
            Amount = payment.Amount,
            RefundStatus = "Completed",
            Reason = reason,
            CreatedOn =  DateTime.UtcNow,
            UpdatedOn = DateTime.UtcNow
        };

        payment.PaymentStatus = "Refunded";
        await _refundRepository.AddAsync(refund);
        await _refundRepository.SaveChangesAsync();     

        return MapRefund(refund);
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
    private static RefundResponseDto MapRefund( Refund refund)
    {
        return new RefundResponseDto
        {
            Id = refund.Id,
            PaymentId = refund.PaymentId,
            Amount = refund.Amount,
            RefundTransactionId =  refund.RefundTransactionId,
            RefundStatus = refund.RefundStatus,
            Reason = refund.Reason,
            CreatedDate = refund.CreatedOn,
            RefundedDate =  refund.UpdatedOn
        };
    }
}