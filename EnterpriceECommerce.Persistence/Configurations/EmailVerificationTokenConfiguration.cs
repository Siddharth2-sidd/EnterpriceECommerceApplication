
using EnterpriceECommerce.Domain.Entitites;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EnterpriceECommerce.Persistence.Configurations
{
    public class EmailVerificationTokenConfiguration : IEntityTypeConfiguration<EmailVerificationToken>
    {
        public void Configure(EntityTypeBuilder<EmailVerificationToken> builder)
        {
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Token).IsRequired();
            builder.Property(e => e.ExpiryDate).IsRequired();
            builder.Property(e => e.UserId).IsRequired();
            builder.HasOne(e => e.User)
                .WithMany(u => u.EmailVerificationTokens)
                .HasForeignKey(e => e.UserId);
                
        }
    }
}
