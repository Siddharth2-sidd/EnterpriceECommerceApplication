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
        private readonly IAddressRepository _addressRepository;

        public OrderServices(IOrderRepository orderRepository, IProductRepository productRepository,
                             ICartRepository cartRepository, IAddressRepository addressRepository) 
        {
            _orderRepository = orderRepository;
            _productRepository = productRepository;
            _cartRepository = cartRepository;
            _addressRepository = addressRepository;
        }
        public async Task<OrderResponseDto> CheckOutAsync(CheckoutRequestDto request, int userId)
        {
            var address = await _addressRepository.GetByIdAsync(request.AddressId);
            
            if (address == null)
                throw new Exception("Address Not Found");
            if (address.UserId != userId)
                throw new UnauthorizedAccessException();
            

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
                ShippingAddress = BuildShippingAddress(address),
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

        public async Task<List<OrderResponseDto>>GetAllOrdersAsync(OrderFilterDto filter)
        {
            if (filter.PageNumber <= 0)
                filter.PageNumber = 1;

            if (filter.PageSize <= 0)
                filter.PageSize = 10;

            var orders = await _orderRepository.GetAllAsync(filter.Status,filter.PaymentStatus,filter.FromDate, filter.ToDate,
                                                            filter.PageNumber,filter.PageSize);
            return orders.Select(MapOrder).ToList();
        }
        public async Task UpdateOrderStatusAsync(int orderId,string status)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);

            if (order == null)
                throw new Exception("Order not found.");

            var validStatuses = new[]{ OrderStatus.Pending,OrderStatus.Confirmed,OrderStatus.Processing,OrderStatus.Shipped,
                                       OrderStatus.Delivered,OrderStatus.Cancelled};

            if (!validStatuses.Contains(status))
            {
                throw new Exception("Invalid order status.");
            }
            order.OrderStatus = status;
            order.UpdatedOn = DateTime.UtcNow;
            await _orderRepository.SaveChangesAsync();
        }
        public async Task UpdatePaymentStatusAsync(int orderId,string paymentStatus)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);

            if (order == null)
                throw new Exception("Order not found.");

            var validStatuses = new[]{PaymentStatus.Pending,PaymentStatus.Paid,PaymentStatus.Failed,PaymentStatus.Refunded};

            if (!validStatuses.Contains(paymentStatus))
            {
                throw new Exception("Invalid payment status.");
            }

            order.PaymentStatus = paymentStatus;
            order.UpdatedOn = DateTime.UtcNow;
            await _orderRepository.SaveChangesAsync();
        }
        public async Task CancelOrderAsync(int orderId)
        {
            var order =  await _orderRepository.GetByIdAsync(orderId);

            if (order == null)
                throw new Exception("Order not found.");

            if (order.OrderStatus == OrderStatus.Delivered)
            {
                throw new Exception("Delivered order cannot be cancelled.");
            }

            if (order.OrderStatus == OrderStatus.Cancelled)
            {
                throw new Exception("Order is already cancelled.");
            }

            order.OrderStatus = OrderStatus.Cancelled;
            order.UpdatedOn = DateTime.UtcNow;
            await _orderRepository.SaveChangesAsync();
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
        private static string BuildShippingAddress(Address address)
        {
            return string.Join(", ",new[]{ address.FullName,address.PhoneNumber,address.AddressLine1,address.AddressLine2,
            address.City,address.State,address.PostalCode,address.Country}.Where(x => !string.IsNullOrWhiteSpace(x)));
        }
    }
}

