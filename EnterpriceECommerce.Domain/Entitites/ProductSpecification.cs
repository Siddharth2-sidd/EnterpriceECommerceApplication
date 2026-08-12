using EnterpriceECommerce.Domain.Comman;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterpriceECommerce.Domain.Entitites
{
    public class ProductSpecification : BaseEntity
    {
        public string SpecificationKey { get; set; } = string.Empty;
        public string SpecificationValue { get; set; } = string.Empty;
        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;

    }
}
