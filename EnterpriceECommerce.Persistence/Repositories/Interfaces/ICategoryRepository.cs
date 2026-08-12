using EnterpriceECommerce.Domain.Entitites;
using EnterpriceECommerce.Domain.Comman;

namespace EnterpriceECommerce.Persistence.Repositories.Interfaces
{
    public interface ICategoryRepository
    {
        Task AddAsync(Category category);
        Task<List<Category>> GetAllAsync(FilterDTO filterDTO);
        Task<Category> GetByIdAsync(int id);
        Task<bool> ExitsAsync(string name);
        Task UpdateAsync(Category category);
        Task DeleteAsync(Category category);
        Task SaveChangesAsync();
    }
}
