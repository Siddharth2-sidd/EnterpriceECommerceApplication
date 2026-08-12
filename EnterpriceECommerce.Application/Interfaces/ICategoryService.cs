using EnterpriceECommerce.Application.DTOs.Category;
using EnterpriceECommerce.Domain.Comman;

namespace EnterpriceECommerce.Application.Interfaces
{
    public interface ICategoryService
    {
        Task CreateAsync(CreateCategoryRequestDTOs create);
        Task<List<CategoryResponseDTOs>> GetAllAsync(FilterDTO filter);
        Task<CategoryResponseDTOs> GetByIdAsync(int id);
        Task UpdateAsync(UpdateCategoryRequestDTOs update);
        Task DeleteAsync(int id);
    } 
}