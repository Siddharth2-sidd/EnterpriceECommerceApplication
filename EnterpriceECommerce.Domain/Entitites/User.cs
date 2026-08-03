using EnterpriceECommerce.Domain.Comman;
namespace EnterpriceECommerce.Domain.Entitites
{
    public class User : BaseEntity
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHashed { get; set; } = string.Empty;
        public int RoleId { get; set; }
        public bool IsActive { get; set; }
        public Role Role { get; set; } = null!;
        public bool IsEmailVerified { get; set; }
        public ICollection<RefreshToken> RefreshTokens { get; set; }= new List<RefreshToken>();
        public ICollection<PasswordResetToken> PasswordResetTokens { get; set; } = new List<PasswordResetToken>();
        public ICollection<EmailVerificationToken> EmailVerificationTokens { get; set; } = new List<EmailVerificationToken>();
    }
}
