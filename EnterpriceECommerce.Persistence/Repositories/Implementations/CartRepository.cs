using EnterpriceECommerce.Domain.Entitites;
using EnterpriceECommerce.Persistence.Context;
using EnterpriceECommerce.Persistence.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EnterpriceECommerce.Persistence.Repositories.Implementations
{
    public class CartRepository : ICartRepository
    {
        private readonly AppDbContext _context;
        public CartRepository(AppDbContext context) 
        {
            _context = context;
        }
        public async Task<Cart?> GetByUserId(int userId)
        {
            return await _context.Carts.Include(x => x.CartItems).ThenInclude(x => x.Product).ThenInclude(x => x.ProductImages)
                                        .FirstOrDefaultAsync(x => x.UserId == userId);
        }
        public async Task<Cart?> GetByIdAsync(int cartId)
        {
            return await _context.Carts.Include(x => x.CartItems).ThenInclude(x => x.Product).FirstOrDefaultAsync(x => x.Id == cartId);
        }
        public async Task<CartItem?> GetCartItemAsync(int cartId, int productId)
        {
            return await _context.CartItems.FirstOrDefaultAsync(x => x.CartId == cartId && x.ProductId == productId);
        }
        public async Task<CartItem?> GetCartItemByIdAsync(int cartItemId)
        {
            return await _context.CartItems.Include(x=>x.Cart).FirstOrDefaultAsync(x => x.Id == cartItemId);
        }
        public async Task AddAsync(Cart cart)
        {
            await _context.Carts.AddAsync(cart);
        }

        public async Task AddItemAsync(CartItem item)
        {
            await _context.CartItems.AddAsync(item);
        }

        public Task RemoveItemAsync(CartItem item)
        {
            _context.CartItems.Remove(item);

            return Task.CompletedTask;
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
