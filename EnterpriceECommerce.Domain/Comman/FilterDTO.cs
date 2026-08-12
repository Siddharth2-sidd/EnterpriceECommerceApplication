using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterpriceECommerce.Domain.Comman
{
    public class FilterDTO
    {
        public string? Search { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; } = 10;
        public string SortBy { get; set; } = "Name";

        public bool Descending { get; set; }
    }
}
