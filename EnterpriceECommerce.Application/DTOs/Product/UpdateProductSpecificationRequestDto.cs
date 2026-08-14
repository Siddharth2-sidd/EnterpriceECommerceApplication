

namespace EnterpriceECommerce.Application.DTOs.Product
{
    public class UpdateProductSpecificationRequestDto
    {
        public int Id { get; set; }

        public string SpecificationKey { get; set; } = string.Empty;

        public string SpecificationValue { get; set; } = string.Empty;
    }
}
