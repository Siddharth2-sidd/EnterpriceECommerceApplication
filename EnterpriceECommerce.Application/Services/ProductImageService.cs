using EnterpriceECommerce.Application.DTOs.Product;
using EnterpriceECommerce.Application.Interfaces;
using EnterpriceECommerce.Domain.Entitites;
using EnterpriceECommerce.Persistence.Repositories.Interfaces;
using Microsoft.AspNetCore.Http;


namespace EnterpriceECommerce.Application.Services
{
    public class ProductImageService : IProductImageService
    {
        private readonly IProductImagesRepository _imageRepository;
        private readonly IProductRepository _productRepository;
        private readonly IBlobStorageService _blobStorage;

        public ProductImageService(IProductImagesRepository imageRepository,IProductRepository productRepository,IBlobStorageService blobStorage)
        {
            _imageRepository = imageRepository;
            _productRepository = productRepository;
            _blobStorage = blobStorage;
        }

        public async Task AddAsync(AddProductImagesRequestDTO AddImage)
        {
            var product = await _productRepository.GetByIdAsync(AddImage.ProductId);
            if (product == null)
            {
                throw new Exception("Product not found.");
            }
            if(AddImage.Images == null || AddImage.Images.Count == 0)
            {
                throw new Exception("Atleast One Image Is required");
            }
            var existingImages = await _imageRepository.GetByProductIdAsync(AddImage.ProductId);
            foreach(var image in AddImage.Images)
            {
                ValidateImage(image);
                var imageURL = await _blobStorage.UploadAsync(image);
                var productImage = new ProductImage
                {
                    ProductId = AddImage.ProductId,
                    ImageUrl = imageURL,
                    IsPrimary = existingImages.Count == 0
                };
                await _imageRepository.AddAsync(productImage);
                existingImages.Add(productImage);
            }
            await _imageRepository.SaveChangesAsync();
        }

        public async Task DeleteAsync(int imageId)
        {
            var image = await _imageRepository.GetByIdAsync(imageId);
            if(image == null)
            {
                throw new Exception("Product image not found");
            }
            await _blobStorage.DeleteAsync(image.ImageUrl);
            await _imageRepository.DeleteAsync(image);
            await _imageRepository.SaveChangesAsync();
        }
        private static void ValidateImage(IFormFile Image)
        {
            var extension = Path.GetExtension(Image.FileName).ToLowerInvariant();
            
            var allowedExtensions = new[]{".jpg",".jpeg",".png",".webp"};

            if (!allowedExtensions.Contains(extension))
            {
                throw new Exception("Only JPG, JPEG, PNG and WEBP images are allowed.");
            }
            if(Image.Length > 5*1024*1024)
            {
                throw new Exception("Image size must be less than 5MB.");
            }
        }
    }
}
