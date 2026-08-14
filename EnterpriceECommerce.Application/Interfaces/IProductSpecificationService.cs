using EnterpriceECommerce.Application.DTOs.Product;

namespace EnterpriceECommerce.Application.Interfaces;

public interface IProductSpecificationService
{
    Task AddAsync(
        AddProductSpecificationRequestDto request);

    Task<List<ProductSpecificationResponseDto>>
        GetByProductIdAsync(int productId);

    Task UpdateAsync(
        UpdateProductSpecificationRequestDto request);

    Task DeleteAsync(int id);
}