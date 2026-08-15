using EnterpriceECommerce.Domain.Comman;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterpriceECommerce.Domain.Entitites
{
    public class InventoryTransaction : BaseEntity
    {
        public int ProductId { get; set; }

        public Product Product { get; set; } = null!;

        public int Quantity { get; set; }

        public string TransactionType { get; set; } = string.Empty;

        public string? Reference { get; set; }

        public string? Notes { get; set; }
    }
}
