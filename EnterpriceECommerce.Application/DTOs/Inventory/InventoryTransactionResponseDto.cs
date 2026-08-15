using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterpriceECommerce.Application.DTOs.Inventory
{
    public class InventoryTransactionResponseDto
    {
        public int Id { get; set; }

        public int ProductId { get; set; }

        public string ProductName { get; set; }
            = string.Empty;

        public int Quantity { get; set; }

        public string TransactionType { get; set; }
            = string.Empty;

        public string? Reference { get; set; }

        public string? Notes { get; set; }
    }
}
