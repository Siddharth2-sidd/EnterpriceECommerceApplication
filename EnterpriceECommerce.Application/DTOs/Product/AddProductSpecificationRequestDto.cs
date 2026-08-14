

namespace EnterpriceECommerce.Application.DTOs.Product
{
    public class AddProductSpecificationRequestDto
    {
        public int ProductId { get; set; }

        public string SpecificationKey { get; set; } = string.Empty;

        public string SpecificationValue { get; set; } = string.Empty;
    }
}
