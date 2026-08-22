using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterpriceECommerce.Application.DTOs.Payment
{
    public class RefundResponseDto
    {
        public int Id { get; set; }
        public int PaymentId { get; set; }
        public decimal Amount { get; set; }
        public string RefundTransactionId { get; set; }  = string.Empty;
        public string RefundStatus { get; set; } = string.Empty;
        public string Reason { get; set; }  = string.Empty;
        public DateTime CreatedDate { get; set; }
        public DateTime? RefundedDate { get; set; }
    }
}
