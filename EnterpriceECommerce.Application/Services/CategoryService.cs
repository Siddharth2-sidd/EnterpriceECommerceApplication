using AutoMapper;
using Azure.Core;
using EnterpriceECommerce.Application.DTOs.Category;
using EnterpriceECommerce.Application.Interfaces;
using EnterpriceECommerce.Domain.Comman;
using EnterpriceECommerce.Domain.Entitites;
using EnterpriceECommerce.Persistence.Repositories.Interfaces;
using Microsoft.AspNetCore.Http;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace EnterpriceECommerce.Application.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;
        private readonly IBlobStorageService _blobStorage;

        public CategoryService(ICategoryRepository categoryRepository, IMapper mapper, IBlobStorageService blobStorage) {
            _categoryRepository = categoryRepository;
            _mapper = mapper;
            _blobStorage = blobStorage;
        }

        public async Task CreateAsync(CreateCategoryRequestDTOs request) {

            if (await _categoryRepository.ExitsAsync(request.Name))
                throw new Exception("Category already Added");
            string imageUrl = string.Empty;
            if (request.Image != null)
            {
                ValidateImage(request.Image);
                imageUrl = await _blobStorage.UploadAsync(request.Image);
            }
            
            var category = _mapper.Map<Category>(request);
            category.ImageUrl = imageUrl;
            //var category1 = new Category
            //{
            //    Name = request.Name,
            //    Description = request.Description,
            //    ImageUrl = request.ImageUrl,
            //};
            
            await _categoryRepository.AddAsync(category);
            await _categoryRepository.SaveChangesAsync();
        }
        public async Task<List<CategoryResponseDTOs>> GetAllAsync(FilterDTO filter) 
        {
            var categories = await _categoryRepository.GetAllAsync(filter);

            //return categories.Select(x => new CategoryResponseDTOs
            //{
            //    Id = x.Id,
            //    Name = x.Name,
            //    Description = x.Description,
            //    ImageUrl = x.ImageUrl,
            //    IsActive = x.IsActive,
            //}).ToList();

            return _mapper.Map<List<CategoryResponseDTOs>>(categories);

        }

        public async Task<CategoryResponseDTOs> GetByIdAsync(int id) 
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            //return new CategoryResponseDTOs
            //{
            //    Id = category.Id,
            //    Name = category.Name,
            //    Description = category.Description,
            //    ImageUrl = category.ImageUrl,
            //    IsActive = category.IsActive,
            //};
            return _mapper.Map<CategoryResponseDTOs>(category);
        }
        public async Task UpdateAsync(UpdateCategoryRequestDTOs update) 
        {
            var category = await _categoryRepository.GetByIdAsync(update.Id);
            if (category == null)
                throw new Exception("Category Not Found");
            
            if (update.Image != null)
            {
                ValidateImage(update.Image);
                await _blobStorage.DeleteAsync(category.ImageUrl);

                category.ImageUrl = await _blobStorage.UploadAsync(update.Image);
            }
            //category.Name = update.Name;
            //category.Description = update.Description;
            //category.ImageUrl = update.ImageUrl;
            //category.IsActive = update.IsActive;
            _mapper.Map(update, category);
            await _categoryRepository.UpdateAsync(category);
            await _categoryRepository.SaveChangesAsync();
        }
        public async Task DeleteAsync(int id) 
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            category.IsDeleted = true;
            await _categoryRepository.UpdateAsync(category);
            await _categoryRepository.SaveChangesAsync();
        }

        private void ValidateImage(IFormFile image)
        {
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
            var extension = Path.GetExtension(image.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(extension))
            {
                throw new Exception("Invalid image format. Only JPG, JPEG, and PNG are allowed.");
            }
            const long maxSizeInBytes = 2 * 1024 * 1024; // 2 MB
            if (image.Length > maxSizeInBytes)
            {
                throw new Exception("Image size exceeds the maximum limit of 2 MB.");
            }
        }

    }
}
