using EnterpriceECommerce.Domain.Entitites;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterpriceECommerce.Persistence.Repositories.Interfaces
{
    public interface IInventoryRepository
    {
        Task AddTransactionAsync(InventoryTransaction transaction);
        Task<List<InventoryTransaction>> GetTransactionsByProductIdAsync(int productId);
        Task SaveChangesAsync();
    }
}
