using EnterpriceECommerce.Domain.Entitites;

namespace EnterpriceECommerce.Persistence.Repositories.Interfaces
{
    public interface IRefreshTokenRepository
    {
        Task AddAsync(RefreshToken refreshtokens);
        Task<RefreshToken> GetByTokenAsync(string token);
        Task SaveChangesAsync();
    }
}
