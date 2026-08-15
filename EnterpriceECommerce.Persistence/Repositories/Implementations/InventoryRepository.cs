using EnterpriceECommerce.Persistence.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using EnterpriceECommerce.Persistence.Context;
using EnterpriceECommerce.Domain.Entitites;

namespace EnterpriceECommerce.Persistence.Repositories.Implementations
{
    public class InventoryRepository : IInventoryRepository
    {
        private readonly AppDbContext _context;
        public InventoryRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task AddTransactionAsync(InventoryTransaction transaction)
        {
            await _context.InventoryTransactions.AddAsync(transaction);
        }
        public async Task<List<InventoryTransaction>> GetTransactionsByProductIdAsync(int productId)
        {
            return await _context.InventoryTransactions.Include(x => x.Product).Where(x=>x.ProductId == productId)
                                  .OrderByDescending(x=>x.CreatedOn).ToListAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

    }
}
