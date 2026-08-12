using EnterpriceECommerce.Application.DTOs.Product;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterpriceECommerce.Application.Interfaces
{
    public interface IProductImageService
    {
        Task AddAsync(AddProductImagesRequestDTO AddImage);
        Task DeleteAsync(int imageId);
    }
}
