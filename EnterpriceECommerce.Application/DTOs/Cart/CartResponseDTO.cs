using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterpriceECommerce.Application.DTOs.Cart
{
    public class CartResponseDTO
    {
        public int CartId { get; set; }

        public int UserId { get; set; }

        public List<CartItemResponseDto> Items { get; set; } = new();

        public decimal SubTotal { get; set; }

        public int TotalItems { get; set; }
    }
}
