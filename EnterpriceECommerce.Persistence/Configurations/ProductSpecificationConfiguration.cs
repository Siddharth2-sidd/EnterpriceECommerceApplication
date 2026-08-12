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
    public class ProductSpecificationConfiguration : IEntityTypeConfiguration<ProductSpecification>
    {
        public void Configure(EntityTypeBuilder<ProductSpecification> builder) 
        {
            builder.ToTable("ProductSpecifications");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.SpecificationKey).HasMaxLength(100).IsRequired();
            builder.Property(x => x.SpecificationValue).HasMaxLength(500).IsRequired();
            builder.HasOne(x => x.Product).WithMany(x => x.ProductSpecifications).HasForeignKey(x => x.ProductId);
        }
    }
}
