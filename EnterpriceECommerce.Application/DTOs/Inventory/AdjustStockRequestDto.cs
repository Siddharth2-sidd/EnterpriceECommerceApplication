using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterpriceECommerce.Application.DTOs.Inventory
{
    public class AdjustStockRequestDto
    {
        public int ProductId { get; set; }

        public int Quantity { get; set; }

        public string TransactionType { get; set; } = string.Empty;

        public string? Reference { get; set; }

        public string? Notes { get; set; }
    }
}
