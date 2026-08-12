
namespace EnterpriceECommerce.Application.DTOs.Category
{
    public class CategoryResponseDTOs
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }
}
