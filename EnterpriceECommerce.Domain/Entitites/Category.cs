using EnterpriceECommerce.Domain.Comman;

namespace EnterpriceECommerce.Domain.Entitites
{
    public class Category : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public bool IsDeleted { get; set; } = false;

        public ICollection<Product> Products { get; set; } = new List<Product>();



    }
}
