using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EnterpriceECommerce.Domain.Entitites;
using Microsoft.EntityFrameworkCore;
namespace EnterpriceECommerce.Persistence.Configurations
{
    public class BrandConfiguration : IEntityTypeConfiguration<Brand>
    {
        public void Configure (EntityTypeBuilder<Brand> builder) 
        {
            builder.ToTable("Brands");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Name).HasMaxLength(100).IsRequired();
            builder.Property(x => x.Description).HasMaxLength(500).IsRequired();
            builder.Property(x => x.IsActive).HasDefaultValue(true);

        }

    }
}
