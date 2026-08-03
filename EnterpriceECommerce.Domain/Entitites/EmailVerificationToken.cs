using EnterpriceECommerce.Domain.Comman;

namespace EnterpriceECommerce.Domain.Entitites
{
    public class EmailVerificationToken : BaseEntity
    {
        public string Token { get; set; } = string.Empty;
        public DateTime ExpiryDate { get; set; }
        public bool IsUsed { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}
