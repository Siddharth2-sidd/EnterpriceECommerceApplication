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
    public class ResetPasswordRepository : IResetPasswordRepository
    {
        private readonly AppDbContext _context;

        public ResetPasswordRepository(AppDbContext context) {
            _context = context;
        }
        public async Task AddAsync(PasswordResetToken token) {
            await _context.PasswordResetTokens.AddAsync(token);
        }

        public async Task<PasswordResetToken> GetByTokenAsync(string token) {
            return await _context.PasswordResetTokens.Include(x => x.User).FirstOrDefaultAsync(x => x.Token == token);
        }

        public Task UpdateAsync(PasswordResetToken token) {
            _context.PasswordResetTokens.Update(token);
            return Task.CompletedTask;
        }
        public async Task SaveChangesAsync() {
            await _context.SaveChangesAsync();
        }
            
    }
}
