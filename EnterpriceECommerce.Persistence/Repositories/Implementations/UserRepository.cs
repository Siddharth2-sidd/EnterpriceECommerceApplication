using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EnterpriceECommerce.Persistence.Context;
using EnterpriceECommerce.Persistence.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using EnterpriceECommerce.Domain.Entitites;

namespace EnterpriceECommerce.Persistence.Repositories.Implementations
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context) {
            _context = context;
        }

        public async Task<User?> GetByEmailAsync(string email) {
            return await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<bool> ExitByEmailAsync(string email) {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }

        public async Task AddUserAsync(User user) {
             await _context.Users.AddAsync(user);
        }

        public async Task SaveChangesAsync() {
            await _context.SaveChangesAsync();
        }
    }
}
