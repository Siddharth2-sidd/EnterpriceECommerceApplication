
using EnterpriceECommerce.Application.DTOs.Product;
using EnterpriceECommerce.Domain.Comman;

namespace EnterpriceECommerce.Application.Interfaces
{
    public interface IProductServices
    {
        Task CreateAsync(CreateProductRequestDTO request);

        Task<List<ProductResponseDTO>> GetAllAsync(ProductFilterDTO filter);

        Task<ProductResponseDTO> GetByIdAsync(int id);

        Task UpdateAsync(UpdateProductRequestDTO request);

        Task DeleteAsync(int id);
    }
}
