namespace EnterpriceECommerce.Application.DTOs.Order;

public class AdminOrderResponseDto
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public int UserId { get; set; }
    public string UserName { get; set; }  = string.Empty;
    public string Email { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;
    public string OrderStatus { get; set; } = string.Empty;
    public string ShippingAddress { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
    public List<AdminOrderItemDto> Items { get; set; } = new();
}