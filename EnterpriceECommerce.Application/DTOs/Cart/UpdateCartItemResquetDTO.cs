using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterpriceECommerce.Application.DTOs.Cart
{
    public class UpdateCartItemResquetDTO
    {
        public int CartItemId { get; set; }

        public int Quantity { get; set; }
    }
}
