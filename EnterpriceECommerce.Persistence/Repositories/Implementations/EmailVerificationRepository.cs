using EnterpriceECommerce.Domain.Entitites;
using EnterpriceECommerce.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using EnterpriceECommerce.Persistence.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterpriceECommerce.Persistence.Repositories.Implementations
{
    public class EmailVerificationRepository : IEmailVerificationRepository
    {
        private readonly AppDbContext _Context;
        public EmailVerificationRepository(AppDbContext context)
        {
            _Context = context;
        }


        public async Task<EmailVerificationToken> GetByTokenAsync(string token) {
            return await _Context.EmailVerificationTokens.Include(x => x.User).FirstOrDefaultAsync(x => x.Token == token);
        }
        public async Task AddAsync(EmailVerificationToken token) {
            await _Context.EmailVerificationTokens.AddAsync(token);
        }
        public Task UpdateAsync(EmailVerificationToken token) {
            _Context.EmailVerificationTokens.Update(token);
            return Task.CompletedTask;
        }
        public async Task SaveChangeAsync() {
            await _Context.SaveChangesAsync();
        }
    }
}
