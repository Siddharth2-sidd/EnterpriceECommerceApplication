using EnterpriceECommerce.Domain.Entitites;
using EnterpriceECommerce.Persistence.Context;
using EnterpriceECommerce.Persistence.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterpriceECommerce.Persistence.Repositories.Implementations
{
    public class RefundRepository : IRefundRepository
    {
        private readonly AppDbContext _context;

        public RefundRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Refund refund)
        {
            await _context.Refunds.AddAsync(refund);
        }

        public async Task<Refund?> GetByIdAsync(int id)
        {
            return await _context.Refunds.Include(x => x.Payment).ThenInclude(x => x.Order).FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<Refund?> GetByPaymentIdAsync(int paymentId)
        {
            return await _context.Refunds.Include(x => x.Payment) .ThenInclude(x => x.Order).FirstOrDefaultAsync(x => x.PaymentId == paymentId);
        }
        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
