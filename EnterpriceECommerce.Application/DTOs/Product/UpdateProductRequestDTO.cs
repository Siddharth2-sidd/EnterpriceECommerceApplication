using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterpriceECommerce.Application.DTOs.Product
{
    public class UpdateProductRequestDTO
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public decimal DiscountPrice { get; set; }

        public int StockQuantity { get; set; }

        public string SKU { get; set; } = string.Empty;

        public bool IsFeatured { get; set; }

        public bool IsActive { get; set; }

        public int CategoryId { get; set; }

        public int BrandId { get; set; }
    }
}
