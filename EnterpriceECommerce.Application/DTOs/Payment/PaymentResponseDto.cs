using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterpriceECommerce.Application.DTOs.Payment
{
    public class PaymentResponseDto
    {
        public int Id { get; set; }

        public int OrderId { get; set; }

        public string TransactionId { get; set; }
            = string.Empty;

        public decimal Amount { get; set; }

        public string PaymentMethod { get; set; }
            = string.Empty;

        public string PaymentStatus { get; set; }
            = string.Empty;

        public DateTime CreatedDate { get; set; }

        public DateTime? PaidDate { get; set; }
    }
}
