using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterpriceECommerce.Application.DTOs.Product
{
    public class ProductImagesResponseDTO
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsPrimary { get; set; }
    }
}
