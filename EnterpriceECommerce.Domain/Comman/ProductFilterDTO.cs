using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterpriceECommerce.Domain.Comman
{
    public class ProductFilterDTO
    {
        public string? Search { get; set; }

        public int? CategoryId { get; set; }

        public int? BrandId { get; set; }

        public decimal? MinPrice { get; set; }

        public decimal? MaxPrice { get; set; }

        public bool? IsFeatured { get; set; }

        public int PageNumber { get; set; } = 1;

        public int PageSize { get; set; } = 10;

        public string SortBy { get; set; } = "Name";

        public bool Descending { get; set; }
    }
}
