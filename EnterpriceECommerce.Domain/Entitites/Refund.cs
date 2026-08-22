
using EnterpriceECommerce.Domain.Comman;

namespace EnterpriceECommerce.Domain.Entitites
{
    public class Refund : BaseEntity
    {
        public int PaymentId { get; set; }
        public Payment Payment { get; set; } = null!;
        public string RefundTransactionId { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string RefundStatus { get; set; }  = "Pending";
        public string Reason { get; set; } = string.Empty;
    }
}
