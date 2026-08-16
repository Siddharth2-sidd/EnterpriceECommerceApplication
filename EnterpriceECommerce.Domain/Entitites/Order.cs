using EnterpriceECommerce.Domain.Comman;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterpriceECommerce.Domain.Entitites
{
    public class Order : BaseEntity
    {
        public string OrderNumber { get; set; } = string.Empty;

        public int UserId { get; set; }

        public User User { get; set; } = null!;

        public decimal SubTotal { get; set; }

        public decimal ShippingAmount { get; set; }

        public decimal DiscountAmount { get; set; }

        public decimal TotalAmount { get; set; }

        public string OrderStatus { get; set; } = "Pending";

        public string PaymentStatus { get; set; } = "Pending";

        public string PaymentMethod { get; set; } = string.Empty;

        public string ShippingAddress { get; set; } = string.Empty;

        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
