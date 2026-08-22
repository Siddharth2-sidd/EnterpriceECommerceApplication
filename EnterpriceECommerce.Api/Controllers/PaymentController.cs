using EnterpriceECommerce.Application.DTOs.Order;
using EnterpriceECommerce.Application.DTOs.Payment;
using EnterpriceECommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EnterpriceECommerce.API.Controllers;

[Authorize]
[Route("api/payments")]
[ApiController]
public class PaymentController : ControllerBase
{
    private readonly IPaymentService _service;
    public PaymentController(IPaymentService service)
    {
        _service = service;
    }

    private int GetUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userId, out var id))
            throw new UnauthorizedAccessException();

        return id;
    }

    [HttpPost]
    public async Task<IActionResult> CreatePayment(CreatePaymentRequestDto request)
    {
        var userId = GetUserId();
        var payment = await _service.CreatePaymentAsync(userId,request);
        return Ok(payment);
    }

    [HttpGet("order/{orderId}")]
    public async Task<IActionResult> GetPaymentByOrder(int orderId)
    {
        var userId = GetUserId();
        var payment =  await _service.GetPaymentByOrderIdAsync(userId,orderId);
        return Ok(payment);
    }
    [HttpPost("{paymentId}/process")]
    public async Task<IActionResult> ProcessPayment(int paymentId)
    {
        var userId = GetUserId();
        var result = await _service.ProcessPaymentAsync(userId,paymentId);

        return Ok(result);
    }
    [HttpPost("{paymentId}/refund")]
    public async Task<IActionResult> Refund(int paymentId,CancelOrderDto request)
    {
        var userId = GetUserId();
        var result =  await _service.RefundAsync(userId, paymentId, request.Reason);

        return Ok(result);
    }
}