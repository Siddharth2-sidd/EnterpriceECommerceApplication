using EnterpriceECommerce.Domain.Comman;

namespace EnterpriceECommerce.Domain.Entitites
{
    public class Product : BaseEntity
    {

        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal DiscountPrice { get; set; }
        public int StockQuantity { get; set; }
        public string SKU { get; set; } = string.Empty;
        public bool IsFeatured { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsDeleted { get; set; } = false;
        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;
        public int BrandId { get; set; }
        public Brand Brand { get; set; } = null!;
        public ICollection<ProductImage> ProductImages { get; set; }
       = new List<ProductImage>();

        public ICollection<ProductSpecification> ProductSpecifications { get; set; }
            = new List<ProductSpecification>();

    }
}
