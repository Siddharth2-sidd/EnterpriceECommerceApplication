using AutoMapper;
using EnterpriceECommerce.Application.DTOs.Brand;
using EnterpriceECommerce.Application.DTOs.Category;
using EnterpriceECommerce.Application.Interfaces;
using EnterpriceECommerce.Domain.Comman;
using EnterpriceECommerce.Domain.Entitites;
using EnterpriceECommerce.Persistence.Repositories.Interfaces;


namespace EnterpriceECommerce.Application.Services
{
    public class BrandService : IBrandService
    {
        private readonly IBrandRepository _brandRepository;
        private readonly IMapper _mapper;

        public BrandService(IBrandRepository brandRepository, IMapper mapper) 
        {
            _brandRepository = brandRepository;
            _mapper = mapper;
        }
        public async Task CreateAsync(CreateCategoryRequestDTOs create) 
        {
            if(await _brandRepository.ExistAsync(create.Name))
            {
                throw new Exception("Brand already Exits");
            }
            var brand = _mapper.Map<Brand>(create);
            await _brandRepository.AddAsync(brand);
            await _brandRepository.SaveChangeAsync();
        }
        public async Task<List<BrandResponseDTO>> GetAllAsync(FilterDTO filter) {
            var brand = await _brandRepository.GetAllAsync(filter);
            return _mapper.Map<List<BrandResponseDTO>>(brand);
        }
        public async Task<BrandResponseDTO> GetByIdAsync(int id) {
            var brand = await _brandRepository.GetByIdAdync(id);
            return _mapper.Map<BrandResponseDTO>(brand);
        }
        public async Task UpdateAsync(UpdateBrandRequestDTO request)
        {
            var brand = await _brandRepository.GetByIdAdync(request.Id);
            if(brand == null)
            {
                throw new Exception("Brand not Found");
            }
            _mapper.Map<UpdateBrandRequestDTO>(brand);
            await _brandRepository.UpdateAsync(brand);
            await _brandRepository.SaveChangeAsync();
        }
        public async Task DeleteAsync(int id) 
        {
            var brand = await _brandRepository.GetByIdAdync(id);
            if (brand == null)
            {
                throw new Exception("Brand not Found");
            }
            brand.IsDeleted = true;
            await _brandRepository.UpdateAsync(brand);
            await _brandRepository.SaveChangeAsync();

        }
    }
}