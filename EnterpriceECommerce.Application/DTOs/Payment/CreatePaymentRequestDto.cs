using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterpriceECommerce.Application.DTOs.Payment
{
    public class CreatePaymentRequestDto
    {
        public int OrderId { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
    }
}
