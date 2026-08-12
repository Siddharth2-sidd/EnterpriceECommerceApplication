using EnterpriceECommerce.Domain.Comman;
using EnterpriceECommerce.Domain.Entitites;
using EnterpriceECommerce.Persistence.Context;
using EnterpriceECommerce.Persistence.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Threading.Tasks;

namespace EnterpriceECommerce.Persistence.Repositories.Implementations
{
    public class BrandRepository : IBrandRepository
    {
        private readonly AppDbContext _context;
        public BrandRepository(AppDbContext context) {
            _context = context;
        }

        public async Task AddAsync(Brand brand)
        {
            await _context.Brands.AddAsync(brand);
        }
        public async Task<List<Brand>> GetAllAsync(FilterDTO filter) 
        {
            var query = _context.Brands.Where(x => !x.IsDeleted);

            if (!string.IsNullOrWhiteSpace(filter.Search)) {
                query = query.Where(x => x.Name.Contains(filter.Search));
            }

            query = filter.Descending ? query.OrderByDescending(x => x.Name) : query.OrderBy(x => x.Name);

            return await query.Skip((filter.PageNumber - 1) * filter.PageSize).Take(filter.PageSize).ToListAsync();
        }
        public async Task<Brand?> GetByIdAsync(int id) 
        {
            return await _context.Brands.FirstOrDefaultAsync(x => x.Id == id);
        }
        public async Task<bool> ExistsAsync(string name) 
        {
            return await _context.Brands.AnyAsync(x => x.Name == name);
        }
        public Task UpdateAsync(Brand brand) 
        {
            _context.Brands.Update(brand);
            return Task.CompletedTask;
        }
        public Task DeleteAsync(Brand brand) 
        {
            brand.IsDeleted = true;
            _context.Brands.Update(brand);
            return Task.CompletedTask;
        }
        public async Task SaveChangesAsync() {
            await _context.SaveChangesAsync();
        }
    }
}
