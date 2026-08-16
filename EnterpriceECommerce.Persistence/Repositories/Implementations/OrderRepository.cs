using EnterpriceECommerce.Domain.Entitites;
using EnterpriceECommerce.Persistence.Context;
using EnterpriceECommerce.Persistence.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EnterpriceECommerce.Persistence.Repositories.Implementations
{
    public class OrderRepository : IOrderRepository
    {
        private readonly AppDbContext _context;
        public OrderRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task AddAsync(Order order) 
        {
             await _context.Orders.AddAsync(order);
        }
        public async Task<Order?> GetByIdAsync(int id)
        {
            return await _context.Orders.Include(x => x.OrderItems).FirstOrDefaultAsync(x => x.Id == id);
        }
        public async Task<List<Order>> GetByUserIdAsync(int userId)
        {
            return await _context.Orders.Include(x => x.OrderItems).Where(x => x.UserId == userId).OrderByDescending(x => x.CreatedOn)
                                        .ToListAsync();
        }
        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
