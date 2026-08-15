using EnterpriceECommerce.Domain.Entitites;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterpriceECommerce.Persistence.Configurations
{
    public class InventoryTransactionConfiguration : IEntityTypeConfiguration<InventoryTransaction>
    {
        public void Configure(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<InventoryTransaction> builder)
        {
            builder.ToTable("InventoryTransactions");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.TransactionType).IsRequired().HasMaxLength(50);
            builder.Property(x => x.Quantity).IsRequired();
            builder.Property(x => x.Reference).HasMaxLength(100);
            builder.Property(x => x.Notes).HasMaxLength(500);
            builder.HasOne(x => x.Product).WithMany().HasForeignKey(x => x.ProductId);
        }
    }
}