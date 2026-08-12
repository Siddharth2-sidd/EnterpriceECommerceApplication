using EnterpriceECommerce.Application.DTOs.Brand;
using EnterpriceECommerce.Application.DTOs.Category;
using EnterpriceECommerce.Domain.Comman;

namespace EnterpriceECommerce.Application.Interfaces
{
    public interface IBrandService
    {
        Task CreateAsync(CreateBrandRequestDTO create);
        Task<List<BrandResponseDTO>> GetAllAsync(FilterDTO filter);
        Task<BrandResponseDTO> GetByIdAsync(int id);
        Task UpdateAsync(UpdateBrandRequestDTO request);
        Task DeleteAsync(int id);
    }
}
