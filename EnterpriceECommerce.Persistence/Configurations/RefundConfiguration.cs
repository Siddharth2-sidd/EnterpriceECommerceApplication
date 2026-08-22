using EnterpriceECommerce.Domain.Entitites;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterpriceECommerce.Persistence.Configurations
{
    public class RefundConfiguration : IEntityTypeConfiguration<Refund>
    {
        public void Configure( EntityTypeBuilder<Refund> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.RefundTransactionId)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(x => x.Amount)
                .HasColumnType("decimal(18,2)");

            builder.Property(x => x.RefundStatus)
                .IsRequired()
                .HasMaxLength(30);

            builder.Property(x => x.Reason)
                .HasMaxLength(500);

            builder.HasOne(x => x.Payment)
                .WithMany()
                .HasForeignKey(x => x.PaymentId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(x => x.RefundTransactionId)
                .IsUnique();
        }
    }
}
