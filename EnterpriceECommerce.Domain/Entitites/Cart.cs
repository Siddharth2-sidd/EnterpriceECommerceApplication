using EnterpriceECommerce.Domain.Comman;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterpriceECommerce.Domain.Entitites
{
    public class Cart :BaseEntity
    {
        public int UserId { get; set; }

        public User User { get; set; } = null!;

        public ICollection<CartItem> CartItems { get; set; }
            = new List<CartItem>();
    }
}
