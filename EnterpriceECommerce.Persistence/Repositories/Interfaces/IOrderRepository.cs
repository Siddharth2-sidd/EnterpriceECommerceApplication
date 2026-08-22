using EnterpriceECommerce.Domain.Entitites;

namespace EnterpriceECommerce.Persistence.Repositories.Interfaces
{
    public interface IOrderRepository
    {
        Task AddAsync(Order order);
        Task<Order?> GetByIdAsync(int id);
        Task<List<Order>> GetByUserIdAsync(int userId);
        Task<List<Order>> GetAllAsync(string? status, string? paymentStatus, DateTime? fromDate, DateTime? toDate, int pageNumber, int pageSize);
        Task SaveChangesAsync();
    }
}
