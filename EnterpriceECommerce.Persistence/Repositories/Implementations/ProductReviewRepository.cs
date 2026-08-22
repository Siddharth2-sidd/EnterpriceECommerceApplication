using EnterpriceECommerce.Domain.Entitites;
using EnterpriceECommerce.Persistence.Context;
using EnterpriceECommerce.Persistence.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EnterpriceECommerce.Persistence.Repositories.Implementations
{
    public class ProductReviewRepository : IProductReviewRepository
    {
        private readonly AppDbContext _context;
        public ProductReviewRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(ProductReview review)
        {
            await _context.productReviews.AddAsync(review);
        }
        public async Task<ProductReview?> GetByIdAsync(int id)
        {
            return await _context.productReviews.Include(x => x.User).FirstOrDefaultAsync(x => x.Id == id);
        }
        public async Task<ProductReview?>GetByUserAndProductAsync(int userId,int productId)
        {
            return await _context.productReviews.FirstOrDefaultAsync(x =>x.UserId == userId &&  x.ProductId == productId);
        }
        public async Task<List<ProductReview>> GetByProductIdAsync(int productId)
        {
            return await _context.productReviews.Include(x => x.User).Where(x => x.ProductId == productId && x.IsApproved)
                                                .OrderByDescending(x => x.CreatedOn).ToListAsync();
        }
        public async Task DeleteAsync(ProductReview review)
        {
            _context.productReviews.Remove(review);

            await Task.CompletedTask;
        }
        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
