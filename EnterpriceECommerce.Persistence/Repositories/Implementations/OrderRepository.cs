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
        public async Task<List<Order>> GetAllAsync(string? status, string? paymentStatus, DateTime? fromDate, DateTime? toDate,
                                                    int pageNumber,int pageSize)
        {
            var query = _context.Orders.Include(x => x.OrderItems).AsQueryable();

            if (!string.IsNullOrWhiteSpace(status))
            {
                query = query.Where(x => x.OrderStatus == status);
            }

            if (!string.IsNullOrWhiteSpace(paymentStatus))
            {
                query = query.Where(x => x.PaymentStatus == paymentStatus);
            }

            if (fromDate.HasValue)
            {
                query = query.Where(x => x.CreatedOn >= fromDate.Value);
            }

            if (toDate.HasValue)
            {
                query = query.Where(x =>x.CreatedOn <= toDate.Value);
            }

            return await query.OrderByDescending(x => x.CreatedOn).Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
        }
    }
}
