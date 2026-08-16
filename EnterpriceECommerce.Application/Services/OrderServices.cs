using EnterpriceECommerce.Application.DTOs.Order;
using EnterpriceECommerce.Application.Interfaces;
using EnterpriceECommerce.Domain.Entitites;
using EnterpriceECommerce.Persistence.Repositories.Interfaces;


namespace EnterpriceECommerce.Application.Services
{
    public class OrderServices :IOrderServices
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IProductRepository _productRepository;
        private readonly ICartRepository _cartRepository;

        public OrderServices(IOrderRepository orderRepository, IProductRepository productRepository, ICartRepository cartRepository) 
        {
            _orderRepository = orderRepository;
            _productRepository = productRepository;
            _cartRepository = cartRepository;
        }
        public async Task<OrderResponseDto> CheckOutAsync(CheckoutRequestDto request, int userId)
        {
            if (string.IsNullOrWhiteSpace(request.ShippingAddress))
            {
                throw new Exception("Shipping address is required.");
            }

            if (string.IsNullOrWhiteSpace(request.PaymentMethod))
            {
                throw new Exception("Payment method is required.");
            }

            var cart = await _cartRepository.GetByUserId(userId);

            if (cart == null || !cart.CartItems.Any())
            {
                throw new Exception("Cart is empty.");
            }

            // Validate stock before creating order
            foreach (var cartItem in cart.CartItems)
            {
                var product = await _productRepository.GetByIdAsync(cartItem.ProductId);

                if (product == null)
                    throw new Exception($"Product {cartItem.ProductId} not found.");

                if (!product.IsActive)
                    throw new Exception($"{product.Name} is not available.");

                if (product.StockQuantity < cartItem.Quantity)
                {
                    throw new Exception($"Insufficient stock for {product.Name}.");
                }
            }

            decimal subTotal = 0;

            var order = new Order
            {
                UserId = userId,
                OrderNumber = GenerateOrderNumber(),
                ShippingAddress = request.ShippingAddress,
                PaymentMethod = request.PaymentMethod,
                OrderStatus = "Pending",
                PaymentStatus = "Pending"
            };

            foreach (var cartItem in cart.CartItems)
            {
                var product =  await _productRepository.GetByIdAsync(cartItem.ProductId);
                var totalPrice = cartItem.UnitPrice *  cartItem.Quantity;
                subTotal += totalPrice;

                var orderItem = new OrderItem
                {
                    ProductId = product!.Id,
                    ProductName = product.Name,
                    SKU =   product.SKU,
                    UnitPrice =  cartItem.UnitPrice,
                    Quantity =  cartItem.Quantity,
                    TotalPrice =  totalPrice
                };
                order.OrderItems.Add(orderItem);
                // Reduce stock
                product.StockQuantity -=  cartItem.Quantity;
            }

            order.SubTotal = subTotal;

            // For now
            order.ShippingAmount =  subTotal >= 5000 ? 0 : 100;
            order.DiscountAmount = 10;
            order.TotalAmount =  order.SubTotal +  order.ShippingAmount - order.DiscountAmount;
            await _orderRepository.AddAsync(order);

            // Clear cart
            foreach (var cartItem in cart.CartItems.ToList())
            {
                await _cartRepository.RemoveItemAsync(cartItem);
            }

            await _orderRepository.SaveChangesAsync();
            await _cartRepository.SaveChangesAsync();
            return MapOrder(order);
        }

        public async Task<OrderResponseDto> GetByIdAsync(int userId,int orderId)
        {
            var order =   await _orderRepository.GetByIdAsync(orderId);

            if (order == null)
                throw new Exception("Order not found.");

            if (order.UserId != userId)
                throw new UnauthorizedAccessException();

            return MapOrder(order);
        }

        public async Task<List<OrderResponseDto>>GetMyOrdersAsync(int userId)
        {
            var orders = await _orderRepository.GetByUserIdAsync(userId);
            return orders.Select(MapOrder).ToList();
        }

        private static string GenerateOrderNumber()
        {
            return $"ORD-{DateTime.UtcNow:yyyyMMddHHmmssfff}";
        }

        private static OrderResponseDto MapOrder(Order order)
        {
            return new OrderResponseDto
            {
                Id = order.Id,
                OrderNumber = order.OrderNumber,
                SubTotal =  order.SubTotal,
                ShippingAmount = order.ShippingAmount,
                DiscountAmount = order.DiscountAmount,
                TotalAmount =  order.TotalAmount,
                OrderStatus =  order.OrderStatus,
                PaymentStatus = order.PaymentStatus,
                PaymentMethod = order.PaymentMethod,
                ShippingAddress = order.ShippingAddress,
                CreatedDate =  order.CreatedOn,

                Items = order.OrderItems.Select(item => new OrderItemResponseDto{
                            Id = item.Id,
                            ProductId = item.ProductId,
                            ProductName = item.ProductName,
                            SKU =  item.SKU,
                            UnitPrice = item.UnitPrice,
                            Quantity = item.Quantity,
                            TotalPrice =  item.TotalPrice}).ToList()
            };
        }
    }
}

