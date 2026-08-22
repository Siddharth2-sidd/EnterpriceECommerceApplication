using EnterpriceECommerce.Domain.Entitites;
using EnterpriceECommerce.Persistence.Context;
using EnterpriceECommerce.Persistence.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EnterpriceECommerce.Persistence.Repositories.Implementations
{
    public class WishlistRepository : IWishlistRepository
    {
        private readonly AppDbContext _context;

        public WishlistRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(WishListItem item)
        {
            await _context.wishListItems.AddAsync(item);
        }

        public async Task<WishListItem?> GetByIdAsync(int id)
        {
            return await _context.wishListItems.Include(x => x.Product).FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<WishListItem?> GetByUserAndProductAsync(int userId,int productId)
        {
            return await _context.wishListItems.FirstOrDefaultAsync(x => x.UserId == userId && x.ProductId == productId);
        }

        public async Task<List<WishListItem>> GetByUserIdAsync(int userId)
        {
            return await _context.wishListItems.Include(x => x.Product).Where(x => x.UserId == userId)
                                               .OrderByDescending(x => x.CreatedDate).ToListAsync();
        }

        public async Task DeleteAsync(WishListItem item)
        {
            _context.wishListItems.Remove(item);
            await Task.CompletedTask;
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
