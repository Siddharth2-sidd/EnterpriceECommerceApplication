using EnterpriceECommerce.Domain.Entitites;
using EnterpriceECommerce.Persistence.Context;
using EnterpriceECommerce.Persistence.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EnterpriceECommerce.Persistence.Repositories.Implementations;

public class ProductSpecificationRepository : IProductSpecificationRepository
{
    private readonly AppDbContext _context;

    public ProductSpecificationRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(ProductSpecification specification)
    {
        await _context.ProductSpecifications.AddAsync(specification);
    }

    public async Task<ProductSpecification?> GetByIdAsync(int id)
    {
        return await _context.ProductSpecifications.FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<List<ProductSpecification>>GetByProductIdAsync(int productId)
    {
        return await _context.ProductSpecifications.Where(x => x.ProductId == productId).ToListAsync();
    }

    public Task UpdateAsync(ProductSpecification specification)
    {
        _context.ProductSpecifications.Update(specification);
        return Task.CompletedTask;
    }

    public Task DeleteAsync(ProductSpecification specification)
    {
        _context.ProductSpecifications.Remove(specification);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}