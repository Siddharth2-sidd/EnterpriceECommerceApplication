using EnterpriceECommerce.Domain.Entitites;
using EnterpriceECommerce.Persistence.Context;
using EnterpriceECommerce.Persistence.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EnterpriceECommerce.Persistence.Repositories.Implementations
{
    public class RefreshTokenRepository : IRefreshTokenRepository
    {
        private readonly AppDbContext _context;

        public RefreshTokenRepository(AppDbContext context) {
            _context = context;
        }
        public async Task AddAsync(RefreshToken refreshToken) {
            await _context.AddAsync(refreshToken);

        }
        public async Task<RefreshToken> GetByTokenAsync(string token) {
            return await _context.RefreshTokens.Include(x => x.User).ThenInclude(x => x.Role).FirstOrDefaultAsync(x => x.Token == token);
        }

        public async Task SaveChangesAsync() {
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw;
            }
        }

    }
}
