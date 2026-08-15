

using EnterpriceECommerce.Domain.Comman;
using EnterpriceECommerce.Domain.Entitites;
using EnterpriceECommerce.Persistence.Context;
using EnterpriceECommerce.Persistence.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EnterpriceECommerce.Persistence.Repositories.Implementations
{
    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _context;

        public ProductRepository(AppDbContext context) 
        {
            _context = context;
        }
        public async Task AddAsync(Product product) 
        {
            await _context.Products.AddAsync(product);
        }
        public async Task<List<Product>> GetAllAsync(ProductFilterDTO filter) 
        {
            var query = _context.Products.Include(x => x.Category).Include(x => x.Brand).Where(x => !x.IsDeleted);

            //Search
            if (!string.IsNullOrWhiteSpace(filter.Search)) 
            {
                query = query.Where(x => x.Name.Contains(filter.Search) || x.Description.Contains(filter.Search) 
                        || x.SKU.Contains(filter.Search)); 
            }

            // Category Filter
            if (filter.CategoryId.HasValue) 
            {
                query = query.Where(x => x.CategoryId == filter.CategoryId.Value);
            }

            // Brand Filter
            if (filter.BrandId.HasValue) 
            {
                query = query.Where(x => x.BrandId == filter.BrandId.Value);
            }

            //Minimum Price
            if (filter.MinPrice.HasValue)
            {
                query = query.Where(x => x.Price >= filter.MinPrice.Value);
            }

            //Maximum Price
            if (filter.MaxPrice.HasValue) 
            {
                query = query.Where(x => x.Price <= filter.MaxPrice.Value);
            }

            // Featured Product
            if (filter.IsFeatured.HasValue)
            {
                query = query.Where(x =>x.IsFeatured == filter.IsFeatured.Value);
            }

            //Sorting
            query = filter.SortBy.ToLower() switch
            {
                "price" => filter.Descending ? query.OrderByDescending(x => x.Price) : query.OrderBy(x => x.Price),
                "stock" => filter.Descending ? query.OrderByDescending(x => x.StockQuantity) : query.OrderBy(x=>x.StockQuantity),
                "name" => filter.Descending ? query.OrderByDescending(x=> x.Name) : query.OrderBy(x=>x.Name),
                _ => query.OrderBy(x=>x.Name)
            };
            // Pagination
            return await query.Skip((filter.PageNumber - 1) * filter.PageSize).Take(filter.PageSize).ToListAsync();
        }

        public async Task<Product?> GetByIdAsync(int id)
        {
            var product = await _context.Products.Include(x => x.Category).Include(x => x.Brand).Include(x => x.ProductImages)
                                            .Include(x => x.ProductImages).FirstOrDefaultAsync(x => x.Id == id);
            return product;
        }
        public async Task<bool> ExitsBySKUAsync(string sku)
        {
            return await _context.Products.AnyAsync(x => x.SKU == sku && !x.IsDeleted);
        }
        public async Task<bool> CategoryExitsAsync(int categoryId)
        {
            return await _context.Categories.AnyAsync(x => x.Id == categoryId && !x.IsDeleted);
        }
        public async Task<bool> BrandExitsAsync(int brandId)
        {
            return await _context.Brands.AnyAsync(x => x.Id == brandId && !x.IsDeleted);
        }
        public Task Update(Product product) 
        {
            _context.Products.Update(product);
            return Task.CompletedTask;
        }
        public Task Delete(Product product)
        {
            product.IsDeleted = true;
            _context.Products.Update(product);
            return Task.CompletedTask;
        }
        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

    }
}
