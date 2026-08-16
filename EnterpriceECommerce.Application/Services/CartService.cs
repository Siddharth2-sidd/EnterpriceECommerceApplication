using AutoMapper;
using EnterpriceECommerce.Application.DTOs.Cart;
using EnterpriceECommerce.Application.Interfaces;
using EnterpriceECommerce.Domain.Entitites;
using EnterpriceECommerce.Persistence.Repositories.Interfaces;

namespace EnterpriceECommerce.Application.Services
{
    public class CartService : ICartService
    {
        private readonly ICartRepository _cartRepository;
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;

        public CartService(ICartRepository cartRepository, IProductRepository productRepository, IMapper mapper)
        {
            _cartRepository = cartRepository;
            _productRepository = productRepository;
            _mapper = mapper;
        }
        public async Task<CartResponseDTO> GetCartAsync(int userId) 
        {
            var cart = await _cartRepository.GetByUserId(userId);
            
            if (cart == null)
            {
                return new CartResponseDTO
                {
                    UserId = userId
                };
            }
            return MapCart(cart);
        }
        public async Task AddToCartAsync(int userId, AddToCartResquestDTO request)
        {
            if(request.Quantity <= 0)
            {
                throw new Exception("Quantity greater than zero");
            }
            var product = await _productRepository.GetByIdAsync(request.ProductId);
            if(product == null)
            {
                throw new Exception("Product not found");
            }
            if (!product.IsActive)
            {
                throw new Exception("Product is not available");
            }
            if (product.StockQuantity < request.Quantity)
                throw new Exception("Insufficient stock.");
            var cart = await _cartRepository.GetByUserId(userId);
            if(cart == null)
            {
                cart = new Cart
                {
                    UserId = userId
                };
                await _cartRepository.AddAsync(cart);
                await _cartRepository.SaveChangesAsync();
            }
            
            var exitingItem = await _cartRepository.GetCartItemAsync(cart.Id, product.Id);
            if(exitingItem != null)
            {
                var newQuantity = exitingItem.Quantity + request.Quantity;
                if (newQuantity > product.StockQuantity)
                    throw new Exception("Request Quantity Exceed Available Stock");
                exitingItem.Quantity = newQuantity;
                
            }
            else
            {
                var item = new CartItem
                {
                    CartId = cart.Id,
                    ProductId = product.Id,
                    Quantity = request.Quantity,
                    UnitPrice = product.DiscountPrice > 0 ? product.DiscountPrice : product.Price
                };
                await _cartRepository.AddItemAsync(item);
            }
            cart.UpdatedOn = DateTime.UtcNow;
            await _cartRepository.SaveChangesAsync();
        }
        public async Task UpdateItemAsync(int userId, UpdateCartItemResquetDTO request)
        {
            if (request.Quantity <= 0)
                throw new Exception("Quantity Greater Than Zero");
            var item = await _cartRepository.GetCartItemByIdAsync(request.CartItemId);
            if(item == null)
            {
                throw new Exception("Cart Item is Empty");
            }
            if (item.Cart.UserId != userId)
                throw new UnauthorizedAccessException();
            var product = await _productRepository.GetByIdAsync(item.ProductId);
            if (product == null)
                throw new Exception("Product not found.");
            if (request.Quantity > product.StockQuantity)
                throw new Exception("Requested quantity exceeds available stock.");
            item.Quantity = request.Quantity;
            item.UnitPrice = product.DiscountPrice > 0 ? product.DiscountPrice : product.Price;
            item.UpdatedOn = DateTime.UtcNow;
            await _cartRepository.SaveChangesAsync();
        }
        public async Task RemoveItemAsync( int userId,int cartItemId)
        {
            var item =await _cartRepository.GetCartItemByIdAsync(cartItemId);

            if (item == null)
                throw new Exception("Cart item not found.");

            if (item.Cart.UserId != userId)
                throw new UnauthorizedAccessException();

            await _cartRepository.RemoveItemAsync(item);

            await _cartRepository.SaveChangesAsync();
        }
        public async Task ClearCartAsync(int userId)
        {
            var cart = await _cartRepository.GetByUserId(userId);
            
            if (cart == null)
                return;
            foreach(var item in cart.CartItems.ToList())
            {
                await _cartRepository.RemoveItemAsync(item);
            }
            cart.UpdatedOn = DateTime.UtcNow;
            await _cartRepository.SaveChangesAsync();
        }

        private static CartResponseDTO MapCart(Cart cart)
        {
            var items = cart.CartItems.Select(item => new CartItemResponseDto{
                    Id = item.Id,
                    ProductId = item.ProductId,
                    ProductName = item.Product.Name,
                    ImageUrl = item.Product.ProductImages.FirstOrDefault(x => x.IsPrimary)?.ImageUrl,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice,
                    TotalPrice = item.UnitPrice * item.Quantity}).ToList();

            return new CartResponseDTO
            {
                CartId = cart.Id,
                UserId = cart.UserId,
                Items = items,
                SubTotal = items.Sum(x => x.TotalPrice),
                TotalItems = items.Sum(x => x.Quantity)
            };
        }

    }
}
