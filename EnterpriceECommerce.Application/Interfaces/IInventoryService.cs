using EnterpriceECommerce.Application.DTOs.Inventory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterpriceECommerce.Application.Interfaces
{
    public interface IInventoryService
    {
        Task AdjustStockAsync(AdjustStockRequestDto request);

        Task<List<InventoryTransactionResponseDto>>GetHistoryAsync(int productId);
    }
}
