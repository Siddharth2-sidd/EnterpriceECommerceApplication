using AutoMapper;
using EnterpriceECommerce.Application.DTOs.Brand;
using EnterpriceECommerce.Domain.Entitites;

namespace EnterpriceECommerce.Application.Mappings
{
    public class BrandProfile : Profile
    {
        public BrandProfile() 
        {
            CreateMap<CreateBrandRequestDTO, Brand>();
            CreateMap<UpdateBrandRequestDTO, Brand>();
            CreateMap<Brand, BrandResponseDTO>();
        }
    }
}
