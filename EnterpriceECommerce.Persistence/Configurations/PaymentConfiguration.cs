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
    public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
    {
        public void Configure(EntityTypeBuilder<Payment> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.TransactionId).IsRequired().HasMaxLength(100);
            builder.HasIndex(x => x.TransactionId).IsUnique();
            builder.Property(x => x.Amount).HasPrecision(18, 2);
            builder.Property(x => x.PaymentMethod).IsRequired().HasMaxLength(50);
            builder.Property(x => x.PaymentStatus).IsRequired().HasMaxLength(50);
            builder.HasOne(x => x.Order).WithMany().HasForeignKey(x => x.OrderId).OnDelete(DeleteBehavior.Restrict);
        }
    }
}