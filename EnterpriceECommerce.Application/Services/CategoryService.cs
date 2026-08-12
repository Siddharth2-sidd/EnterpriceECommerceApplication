using AutoMapper;
using EnterpriceECommerce.Application.DTOs.Category;
using EnterpriceECommerce.Application.Interfaces;
using EnterpriceECommerce.Domain.Comman;
using EnterpriceECommerce.Domain.Entitites;
using EnterpriceECommerce.Persistence.Repositories.Interfaces;

namespace EnterpriceECommerce.Application.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;

        public CategoryService(ICategoryRepository categoryRepository, IMapper mapper) {
            _categoryRepository = categoryRepository;
            _mapper = mapper;
        }

        public async Task CreateAsync(CreateCategoryRequestDTOs request) {

            if (await _categoryRepository.ExitsAsync(request.Name))
                throw new Exception("Category already Added");

            var category = _mapper.Map<Category>(request);
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
            //category.Name = update.Name;
            //category.Description = update.Description;
            //category.ImageUrl = update.ImageUrl;
            //category.IsActive = update.IsActive;
            _mapper.Map<Category>(update);
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

    }
}
