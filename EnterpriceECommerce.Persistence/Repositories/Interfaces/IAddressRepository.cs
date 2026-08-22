using EnterpriceECommerce.Domain.Entitites;

namespace EnterpriceECommerce.Persistence.Repositories.Interfaces
{
    public interface IAddressRepository
    {
        Task AddAsync(Address address);
        Task<Address?> GetByIdAsync(int id);
        Task<List<Address>> GetByUserIdAsync(int userId);
        Task DeleteAsync(Address address);
        Task SaveChangesAsync();
    }
}
