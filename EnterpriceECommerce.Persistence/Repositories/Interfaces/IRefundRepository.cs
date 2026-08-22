using EnterpriceECommerce.Domain.Entitites;


namespace EnterpriceECommerce.Persistence.Repositories.Interfaces
{
    public interface IRefundRepository
    {
        Task AddAsync(Refund refund);
        Task<Refund?> GetByIdAsync(int id);
        Task<Refund?> GetByPaymentIdAsync(int paymentId);
        Task SaveChangesAsync();
    }
}
