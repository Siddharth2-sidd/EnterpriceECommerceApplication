using EnterpriceECommerce.Domain.Comman;
using EnterpriceECommerce.Domain.Entitites;

namespace EnterpriceECommerce.Persistence.Repositories.Interfaces
{
    public interface IBrandRepository
    {
        Task AddAsync(Brand brand);
        Task<List<Brand>> GetAllAsync(FilterDTO filter);
        Task<Brand?> GetByIdAdync(int id);
        Task<bool> ExistAsync(string name);
        Task UpdateAsync(Brand brand);
        Task DeleteAsync(Brand brand);
        Task SaveChangeAsync();

    }
}
