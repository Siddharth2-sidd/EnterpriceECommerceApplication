using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterpriceECommerce.Application.DTOs.Product
{
    public class ProductSpecificationResponseDto
    {
        public int Id { get; set; }

        public int ProductId { get; set; }

        public string SpecificationKey { get; set; } = string.Empty;

        public string SpecificationValue { get; set; } = string.Empty;
    }
}
