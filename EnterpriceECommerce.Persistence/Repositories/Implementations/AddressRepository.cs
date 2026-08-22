using EnterpriceECommerce.Domain.Entitites;
using EnterpriceECommerce.Persistence.Context;
using EnterpriceECommerce.Persistence.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EnterpriceECommerce.Persistence.Repositories.Implementations
{
    public class AddressRepository : IAddressRepository
    {
        private readonly AppDbContext _context;
        public AddressRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task AddAsync(Address address)
        {
            await _context.Addresses.AddAsync(address);
        }

        public async Task<Address?> GetByIdAsync(int id)
        {
            var address = await _context.Addresses.FirstOrDefaultAsync(x => x.Id == id);
            return address;
        }
        public async Task<List<Address>> GetByUserIdAsync(int userId)
        {
            var addresses = await _context.Addresses.Where(x => x.UserId == userId).OrderByDescending(x => x.IsDefault)
                                               .ThenByDescending(x => x.CreatedOn).ToListAsync();
            return addresses;
        }
        public  Task DeleteAsync(Address address)
        {
              _context.Addresses.Remove(address);
            return Task.CompletedTask;
        }
        public async Task SaveChangesAsync()
        {
             await _context.SaveChangesAsync();
        }
    }
}
