using AutoMapper;
using EnterpriceECommerce.Application.DTOs.Category;
using EnterpriceECommerce.Domain.Entitites;

namespace EnterpriceECommerce.Application.Mappings
{
    public class CategoryProfile : Profile
    {
        public CategoryProfile() 
        {
            CreateMap<CreateCategoryRequestDTOs, Category>();
            CreateMap<UpdateCategoryRequestDTOs, Category>();
            CreateMap<Category, CategoryResponseDTOs>();
        }
    }
}
