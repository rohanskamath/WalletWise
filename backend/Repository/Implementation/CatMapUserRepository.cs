using ExpenseTracker.Data;

using ExpenseTracker.Model;
using ExpenseTracker.Model.DTO;
using ExpenseTracker.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Repository.Implementation
{
    public class CatMapUserRepository : ICatMapUserRepository
    {
        private readonly ExpenseTrackerDbContext _context;

        public CatMapUserRepository(ExpenseTrackerDbContext context)
        {
            _context = context;
        }
        public async Task<List<CatMapUserDTO>> AddAsync(List<CatMapUserDTO> cat)
        {
            var catMapUsers = new List<CatMapUser>();

            foreach (var dto in cat)
            {
                var newCat= await _context.Categories.FindAsync(dto.CategoryId);
                var user = await _context.Users.FindAsync(dto.EmailID); 
                if (user == null || newCat == null)
                {
                  
                    throw new InvalidOperationException($"User with EmailID '{dto.EmailID}' not found.");
                }

                var catMapUser = new CatMapUser
                {
                    CategoryId = dto.CategoryId,
                    EmailID = dto.EmailID,
                    User = user,
                    category = newCat
                    // You may map other properties as needed
                };

                catMapUsers.Add(catMapUser);
            }
            _context.CategoriesMapUsers.AddRange(catMapUsers);
            await _context.SaveChangesAsync();
            return cat;
        }
        public async Task<List<CatMapUserDTO>> UpdateAsync(List<CatMapUserDTO> cat)
        {
            var catMapUsers = new List<CatMapUser>();

            foreach (var dto in cat)
            {
                var existingCatMapUser = await _context.CategoriesMapUsers
                    .FirstOrDefaultAsync(cmu => cmu.CategoryId == dto.CategoryId && cmu.EmailID == dto.EmailID);

                if (existingCatMapUser == null)
                {
                    var newCat = await _context.Categories.FindAsync(dto.CategoryId);
                    var user = await _context.Users.FindAsync(dto.EmailID);

                    if (user == null || newCat == null)
                    {
                        throw new InvalidOperationException($"User with EmailID '{dto.EmailID}' or Category with ID '{dto.CategoryId}' not found.");
                    }

                    var catMapUser = new CatMapUser
                    {
                        CategoryId = dto.CategoryId,
                        EmailID = dto.EmailID,
                        User = user,
                        category = newCat
                        // You may map other properties as needed
                    };

                    catMapUsers.Add(catMapUser);
                }
            }

            if (catMapUsers.Any())
            {
                _context.CategoriesMapUsers.AddRange(catMapUsers);
                await _context.SaveChangesAsync();
            }

            return cat;
        }
        public async Task<List<CatMapUserDTO>> GetAllAsync()
        {
            var catMapUsers = await _context.CategoriesMapUsers
                .Include(cmu => cmu.User)
                .Include(cmu => cmu.category)
                .ToListAsync();

            var catMapUserDTOs = catMapUsers.Select(cmu => new CatMapUserDTO
            {
                CategoryId = cmu.CategoryId,
                EmailID = cmu.EmailID
                // Map other properties if needed
            }).ToList();

            return catMapUserDTOs;
        }
        public async Task<List<CatMapUserDTOResponse>> GetByEmailAsync(string emailID)
        {
            var catMapUsers = await _context.CategoriesMapUsers
                .Include(cmu => cmu.User)
                .Include(cmu => cmu.category)
                .Where(cmu => cmu.EmailID == emailID)
                .ToListAsync();

            if (catMapUsers == null || !catMapUsers.Any())
            {
                return null;
            }

            var catMapUserDTOs = catMapUsers.Select(cmu => new CatMapUserDTOResponse
            {
                CategoryId = cmu.CategoryId,
                EmailID = cmu.EmailID,
                CatName=cmu.category.CategoryName
                
            }).ToList();

            return catMapUserDTOs;
        }

    }

}
