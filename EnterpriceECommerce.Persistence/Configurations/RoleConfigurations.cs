using Microsoft.EntityFrameworkCore;
using EnterpriceECommerce.Domain.Entitites;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EnterpriceECommerce.Domain.Enums;

namespace EnterpriceECommerce.Persistence.Configurations
{
    public class RoleConfigurations : IEntityTypeConfiguration<Role>
    {
        public void Configure(EntityTypeBuilder<Role> builder)
        {
            builder.ToTable("Roles");
            builder.HasKey(r => r.Id);
            builder.Property(r => r.Name).IsRequired().HasMaxLength(50);
            builder.HasIndex(r => r.Name).IsUnique();
            builder.HasData(new Role { Id = (int)RoleEnum.Admin, Name = "Admin" }, new Role { Id = (int)RoleEnum.Seller, Name = "Seller" }, new Role { Id = (int)RoleEnum.Customer, Name = "Customer" });
        }

    }
}
