using AutoMapper;
using EnterpriceECommerce.Application.DTOs.Product;
using EnterpriceECommerce.Domain.Entitites;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterpriceECommerce.Application.Mappings
{
    public class ProductProfile : Profile
    {
        public ProductProfile() 
        {
            CreateMap<CreateProductRequestDTO, Product>();
            CreateMap<UpdateProductRequestDTO, Product>();
            CreateMap<Product, ProductResponseDTO>()
            .ForMember(
                dest => dest.CategoryName,
                opt => opt.MapFrom(src => src.Category.Name))
            .ForMember(
                dest => dest.BrandName,
                opt => opt.MapFrom(src => src.Brand.Name));
        }
    }
}

