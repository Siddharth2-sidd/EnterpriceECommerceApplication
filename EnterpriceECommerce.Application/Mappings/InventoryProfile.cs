using AutoMapper;
using EnterpriceECommerce.Application.DTOs.Inventory;
using EnterpriceECommerce.Domain.Entitites;

namespace EnterpriceECommerce.Application.Mappings
{
    public class InventoryProfile : Profile
    {
        public InventoryProfile() 
        {
            CreateMap<InventoryTransaction, InventoryTransactionResponseDto>()
                .ForMember(dest => dest.ProductName,
                           opt => opt.MapFrom(src => src.Product.Name));
        }

    }
}
