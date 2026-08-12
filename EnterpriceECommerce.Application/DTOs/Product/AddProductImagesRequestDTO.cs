using Microsoft.AspNetCore.Http;


namespace EnterpriceECommerce.Application.DTOs.Product
{
    public class AddProductImagesRequestDTO
    {
        public int ProductId { get; set; }
        public List<IFormFile> Images { get; set; } = new List<IFormFile>(); 
    }
}
