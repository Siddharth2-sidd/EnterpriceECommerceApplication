
using AutoMapper;
using Azure.Core;
using EnterpriceECommerce.Application.DTOs.Payment;
using EnterpriceECommerce.Application.DTOs.Product;
using EnterpriceECommerce.Application.Interfaces;
using EnterpriceECommerce.Domain.Comman;
using EnterpriceECommerce.Domain.Entitites;
using EnterpriceECommerce.Persistence.Repositories.Interfaces;

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
        public async Task<List<ProductResponseDTO>> GetAllAsync(ProductFilterDTO filter)
        {
            var products = await _productRepository.GetAllAsync(filter);
            if(products == null)
            {
                throw new Exception("Product Not Found");
            }
             return _mapper.Map<List<ProductResponseDTO>>(products);
            
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

            if (product.SKU != request.SKU && await _productRepository.ExitsBySKUAsync(request.SKU))
            {
                throw new Exception("Product SKU already exists.");
            }

            if (!await _productRepository.CategoryExitsAsync(request.CategoryId))
            {
                throw new Exception("Category not found.");
            }

            if (!await _productRepository.BrandExitsAsync(request.BrandId))
            {
                throw new Exception("Brand not found.");
            }
            _mapper.Map(request, product);

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

        // Admin
        public async Task<ProductResponseDTO> AdminCreateAsync(AdminCreateProductDto request)
        {
            if (request.Price < 0)
                throw new Exception("Price cannot be negative.");

            if (request.StockQuantity < 0)
                throw new Exception("Stock cannot be negative.");

            var existing =await _productRepository.ExitsBySKUAsync(request.SKU);

            if (existing != null)
            {
                throw new Exception("SKU already exists.");
            }

            var product = new Product
            {
                CategoryId = request.CategoryId,
                BrandId = request.BrandId,
                Name =  request.Name,
                SKU = request.SKU,
                Description = request.Description,
                Price = request.Price,
                StockQuantity = request.StockQuantity,
                IsFeatured =   request.IsFeatured,
                IsActive =   request.IsActive,           
                CreatedOn =  DateTime.UtcNow
            };

            await _productRepository.AddAsync(product);
            await _productRepository.SaveChangesAsync();

            return Map(product);
        }
        public async Task<ProductResponseDTO> AdminUpdateAsync(int productId, AdminUpdateProductDto request)
        {
            var product =await _productRepository.GetByIdAsync(productId);

            if (product == null)
                throw new Exception("Product not found.");
            if (request.Price < 0)
                throw new Exception("Price cannot be negative.");

            if (request.StockQuantity < 0)
                throw new Exception("Stock cannot be negative.");

            var existing = await _productRepository.ExitsBySKUAsync(request.SKU);

            if (existing != null)
            {
                throw new Exception("SKU already exists.");
            }


            product.CategoryId = request.CategoryId;
            product.BrandId = request.BrandId;
            product.Name = request.Name;
            product.SKU = request.SKU;
            product.Description = request.Description;
            product.Price = request.Price;
            product.StockQuantity = request.StockQuantity;
            product.IsFeatured = request.IsFeatured;
            product.IsActive = request.IsActive;
            product.CreatedOn = DateTime.UtcNow;
            

            await _productRepository.Update(product);
            await _productRepository.SaveChangesAsync();

            return Map(product);
        }
        public async Task UpdateStockAsync(int productId,int stockQuantity)
        {
            if (stockQuantity < 0)
            {
                throw new Exception("Stock cannot be negative.");
            }

            var product =  await _productRepository.GetByIdAsync(productId);

            if (product == null)
            {
                throw new Exception("Product not found.");
            }

            product.StockQuantity =  stockQuantity;

            product.UpdatedOn = DateTime.UtcNow;

            await _productRepository.SaveChangesAsync();
        }
        public async Task AdminDeleteAsync(int productId) 
        {
            var product =  await _productRepository.GetByIdAsync(productId);

            if (product == null)
            {
                throw new Exception("Product not found.");
            }
            product.IsActive = false;
            product.UpdatedOn = DateTime.UtcNow;

            await _productRepository.SaveChangesAsync();
        }
        private static ProductResponseDTO Map(Product product)
        {
            return new ProductResponseDTO
            {
                Id = product.Id,
                CategoryId = product.CategoryId,
                BrandId = product.BrandId,
                Name = product.Name,
                SKU = product.SKU,
                Description = product.Description,
                Price = product.Price,
                StockQuantity = product.StockQuantity,
                IsFeatured = product.IsFeatured,
                IsActive = product.IsActive,
            };
        }
    }
}
