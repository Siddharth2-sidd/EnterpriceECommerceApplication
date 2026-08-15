using AutoMapper;
using EnterpriceECommerce.Application.DTOs.Product;
using EnterpriceECommerce.Application.Interfaces;
using EnterpriceECommerce.Domain.Entitites;
using EnterpriceECommerce.Persistence.Repositories.Interfaces;

namespace EnterpriceECommerce.Application.Services;

public class ProductSpecificationService : IProductSpecificationService
{
    private readonly IProductSpecificationRepository  _repository;

    private readonly IProductRepository  _productRepository;

    private readonly IMapper _mapper;

    public ProductSpecificationService(IProductSpecificationRepository repository,IProductRepository productRepository,IMapper mapper)
    {
        _repository = repository;
        _productRepository = productRepository;
        _mapper = mapper;
    }

    public async Task AddAsync(AddProductSpecificationRequestDto request)
    {
        var product = await _productRepository.GetByIdAsync(request.ProductId);

        if (product == null)
            throw new Exception("Product not found.");

        if (string.IsNullOrWhiteSpace(request.SpecificationKey))
        {
            throw new Exception("Specification key is required.");
        }

        if (string.IsNullOrWhiteSpace( request.SpecificationValue))
        {
            throw new Exception("Specification value is required.");
        }

        var specification = new ProductSpecification
        {
            ProductId = request.ProductId,

            SpecificationKey = request.SpecificationKey,

            SpecificationValue = request.SpecificationValue
        };

        await _repository.AddAsync(specification);

        await _repository.SaveChangesAsync();
    }

    public async Task<List<ProductSpecificationResponseDto>> GetByProductIdAsync(int productId)
    {
        var specifications = await _repository.GetByProductIdAsync(productId);

        return _mapper.Map<List<ProductSpecificationResponseDto>>(specifications);
    }

    public async Task UpdateAsync(UpdateProductSpecificationRequestDto request)
    {
        var specification = await _repository.GetByIdAsync(request.Id);

        if (specification == null)
            throw new Exception("Specification not found.");

        specification.SpecificationKey = request.SpecificationKey;
        specification.SpecificationValue = request.SpecificationValue;

        await _repository.UpdateAsync(specification);

        await _repository.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var specification = await _repository.GetByIdAsync(id);

        if (specification == null)
            throw new Exception("Specification not found.");

        await _repository.DeleteAsync(specification);

        await _repository.SaveChangesAsync();
    }
}