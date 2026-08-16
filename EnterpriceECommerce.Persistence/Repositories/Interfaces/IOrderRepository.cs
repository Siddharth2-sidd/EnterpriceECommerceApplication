using EnterpriceECommerce.Domain.Entitites;

namespace EnterpriceECommerce.Persistence.Repositories.Interfaces
{
    public interface IOrderRepository
    {
        Task AddAsync(Order order);
        Task<Order?> GetByIdAsync(int id);
        Task<List<Order>> GetByUserIdAsync(int userId);
        Task SaveChangesAsync();
    }
}
