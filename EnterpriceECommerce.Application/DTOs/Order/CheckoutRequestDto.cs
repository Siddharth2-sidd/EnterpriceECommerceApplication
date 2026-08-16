using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterpriceECommerce.Application.DTOs.Order
{
    public class CheckoutRequestDto
    {
        public string ShippingAddress { get; set; } = string.Empty;

        public string PaymentMethod { get; set; } = string.Empty;
    }
}
