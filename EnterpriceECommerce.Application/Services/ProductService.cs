
using AutoMapper;
using EnterpriceECommerce.Application.DTOs.Product;
using EnterpriceECommerce.Application.Interfaces;
using EnterpriceECommerce.Domain.Comman;
using EnterpriceECommerce.Domain.Entitites;
using EnterpriceECommerce.Persistence.Repositories.Interfaces;
using System.Reflection.Metadata.Ecma335;

namespace EnterpriceECommerce.Application.Services
{
    public class ProductService : IProductServices
    {
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;

        public ProductService(IProductRepository productRepository, IMapper mapper)
        {
            _productRepository = productRepository;
            _mapper = mapper;
        }

        public async Task CreateAsync(CreateProductRequestDTO request) 
        {
            if (await _productRepository.ExitsBySKUAsync(request.SKU))
                throw new Exception("Product SKU already exists.");

            if (!await _productRepository.CategoryExitsAsync(request.CategoryId))
                throw new Exception("Category not found.");

            if (!await _productRepository.BrandExitsAsync(request.BrandId))
                throw new Exception("Brand not found.");

            var product = _mapper.Map<Product>(request);

            await _productRepository.AddAsync(product);

            await _productRepository.SaveChangesAsync();
        }
        public async Task<ProductResponseDTO> GetAllAsync(ProductFilterDTO filter)
        {
            var products = await _productRepository.GetAllAsync(filter);
            if(products == null)
            {
                throw new Exception("Product Not Found");
            }
             return _mapper.Map<ProductResponseDTO>(products);
            
        }
        public async Task<ProductResponseDTO> GetByIdAsync(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if(product == null)
            {
                throw new Exception("Product Not Found");
            }
            return _mapper.Map<ProductResponseDTO>(product);
        }

        public async Task UpdateAsync(UpdateProductRequestDTO request)
        {
            var product = await _productRepository.GetByIdAsync(request.Id);

            if (product == null)
                throw new Exception("Product not found.");

            if (product.SKU != request.SKU &&
                await _productRepository.ExitsBySKUAsync(request.SKU))
            {
                throw new Exception(
                    "Product SKU already exists.");
            }

            if (!await _productRepository.CategoryExitsAsync(request.CategoryId))
            {
                throw new Exception("Category not found.");
            }

            if (!await _productRepository.BrandExitsAsync(request.BrandId))
            {
                throw new Exception("Brand not found.");
            }
            _mapper.Map<Product>(request);

            await _productRepository.Update(product);

            await _productRepository.SaveChangesAsync();
        }
        public async Task DeleteAsync(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null)
            {
                throw new Exception("Product Not Found");
            }
            await _productRepository.Delete(product);
            await _productRepository.SaveChangesAsync();
        }
    }
}
