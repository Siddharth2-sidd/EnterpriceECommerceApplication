using EnterpriceECommerce.Application.DTOs.Address;
using EnterpriceECommerce.Application.Interfaces;
using EnterpriceECommerce.Domain.Entitites;
using EnterpriceECommerce.Persistence.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterpriceECommerce.Application.Services
{
    public class AddressServices : IAddressService
    {
        private readonly IAddressRepository _addressRepository;
        public AddressServices(IAddressRepository addressRepository)
        {
            _addressRepository = addressRepository;
        }
        public async Task<AddressResponseDto> CreateAsync(int userId, CreateAddressDto request)
        {
            var addresses = await _addressRepository.GetByUserIdAsync(userId);

            if (!addresses.Any() || request.IsDefault)
            {
                foreach (var address in addresses)
                {
                    address.IsDefault = false;
                }
            }

            var entity = new Address
            {
                UserId = userId,
                FullName = request.FullName,
                PhoneNumber = request.PhoneNumber,
                AddressLine1 = request.AddressLine1,
                AddressLine2 = request.AddressLine2,
                City = request.City,
                State = request.State,
                PostalCode = request.PostalCode,
                Country = request.Country,
                AddressType = request.AddressType,
                IsDefault = !addresses.Any() || request.IsDefault
            };

            await _addressRepository.AddAsync(entity);
            await _addressRepository.SaveChangesAsync();

            return Map(entity);
        }
        public async Task<AddressResponseDto> UpdateAsync(int userId, int addressId, UpdateAddressDto request)
        {
            var address = await _addressRepository.GetByIdAsync(addressId);

            if(address == null)
            {
                throw new Exception("Address Not Found");
            }

            if (address.UserId != userId)
                throw new Exception("Unauthorize User");

            var addresses = await _addressRepository.GetByUserIdAsync(userId);

            if (request.IsDefault)
            {
                foreach (var item in addresses)
                {
                    item.IsDefault = false;
                }
            }

            address!.FullName = request.FullName;
            address.PhoneNumber = request.PhoneNumber;
            address.AddressLine1 = request.AddressLine1;
            address.AddressLine2 = request.AddressLine2;
            address.City =  request.City;
            address.State = request.State;
            address.PostalCode = request.PostalCode;
            address.Country =  request.Country;
            address.AddressType = request.AddressType;
            address.IsDefault = request.IsDefault;
            address.UpdatedOn = DateTime.UtcNow;

            await _addressRepository.SaveChangesAsync();
            return Map(address);
        }
        public async Task<List<AddressResponseDto>> GetMyAddressAsync(int userId)
        {
            var addresses = await _addressRepository.GetByUserIdAsync(userId);
            return addresses.Select(Map).ToList();
        }
        public async Task DeleteAsync(int userId, int addressId)
        {
            var address = await _addressRepository.GetByIdAsync(addressId);
            if (address == null)
                throw new Exception("Address not found");
            if (address.UserId != userId)
                throw new Exception("UAuthorize Access");
            await _addressRepository.DeleteAsync(address);
            await _addressRepository.SaveChangesAsync();
        }
        public async Task SetDefaultAsync(int userId,int addressId)
        {
            var address = await _addressRepository.GetByIdAsync(addressId);
            if (address == null)
                throw new Exception("Address Not Found");
            if (address.UserId != userId)
                throw new Exception("Unauthorize Access");

            var addresses = await _addressRepository.GetByUserIdAsync(userId);

            foreach (var item in addresses)
            {
                item.IsDefault = false;
            }

            address!.IsDefault = true;

            await _addressRepository.SaveChangesAsync();
        }
        private static AddressResponseDto Map(Address address)
        {
            return new AddressResponseDto
            {
                Id = address.Id,
                FullName = address.FullName,
                PhoneNumber = address.PhoneNumber,
                AddressLine1 = address.AddressLine1,
                AddressLine2 = address.AddressLine2,
                City = address.City,
                State = address.State,
                PostalCode = address.PostalCode,
                Country = address.Country,
                AddressType = address.AddressType,
                IsDefault = address.IsDefault
            };
        }

    }
}
