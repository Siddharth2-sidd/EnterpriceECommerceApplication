using EnterpriceECommerce.Domain.Entitites;
using EnterpriceECommerce.Persistence.Context;
using EnterpriceECommerce.Persistence.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EnterpriceECommerce.Persistence.Repositories.Implementations
{
    public class ProductImagesRepository : IProductImagesRepository
    {
        private readonly AppDbContext _context;
        public ProductImagesRepository(AppDbContext context) {
            _context = context;
        }
        public async Task AddAsync(ProductImage image)
        {
            await _context.ProductImages.AddAsync(image);
        }
        public async Task<ProductImage?> GetByIdAsync(int id)
        {
            var productImage = await _context.ProductImages.FirstOrDefaultAsync(x => x.Id == id);
            if(productImage == null)
            {
                throw new Exception("ProductImage Not Found");
            }
            return productImage;
        }
        public async Task<List<ProductImage>> GetByProductIdAsync(int productId)
        {
            var productImages = await _context.ProductImages.Where(x => x.ProductId == productId).ToListAsync();
            if (productImages == null)
            {
                throw new Exception("ProductImage Not Found");
            }
            return productImages;
        }
        public Task DeleteAsync(ProductImage image)
        {
            _context.ProductImages.Remove(image);

            return Task.CompletedTask;
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
