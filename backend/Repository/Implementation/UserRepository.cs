using ExpenseTracker.Data;
using ExpenseTracker.Model;
using ExpenseTracker.Model.DTO;
using ExpenseTracker.Repository.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Globalization;


namespace ExpenseTracker.Repository.Implementation
{
    public class UserRepository : IUserRepository
    {
        private readonly ExpenseTrackerDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserRepository(ExpenseTrackerDbContext context, IWebHostEnvironment webHostEnvironment, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User> GetByIdAsync(string id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<User> AddAsync(User user)
        {

            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            user.CreatedDate= DateTime.UtcNow;
            user.FullName = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(user.FullName.ToLower());
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            User responseUser=ConvertDate(user);
            return user;
        }
        public User ConvertDate(User user)
        {
            TimeZoneInfo istZone = TimeZoneInfo.FindSystemTimeZoneById("India Standard Time");
            DateTime istNow = TimeZoneInfo.ConvertTimeFromUtc(user.CreatedDate, istZone);
            user.CreatedDate = istNow;
            return user;
        }

        public async Task<User> UploadProfileImageAsync(string emailId, string imageName)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.EmailID == emailId);

            if (user != null)
            {
                user.ImageName = imageName;
                await _context.SaveChangesAsync();
            }

            return user;
        }
        public async Task<User> AddSocialAsync(User user)
        {

            //user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }
        public async Task<User> UpdateAsync(User user, IFormFile? imageFile)
        {
            // Update user details
            user.FullName = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(user.FullName.ToLower());

            // Handle image upload if a new file is provided
            if (imageFile != null && imageFile.Length > 0)
            {
                // Ensure _webHostEnvironment and ContentRootPath are not null
                if (_webHostEnvironment == null || string.IsNullOrEmpty(_webHostEnvironment.ContentRootPath))
                {
                    throw new InvalidOperationException("ContentRootPath is not configured properly.");
                }

                // Define the directory and file path for the image
                string uploadsFolder = Path.Combine(_webHostEnvironment.ContentRootPath, "Images");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // Create a unique file name and file path
                string uniqueFileName = $"{Guid.NewGuid()}_{imageFile.FileName}";
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                // Copy the file to the specified path
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(fileStream);
                }

                // Construct the URL for the uploaded image
                var request = _httpContextAccessor?.HttpContext?.Request;
                if (request == null)
                {
                    throw new InvalidOperationException("HTTP context or request is not available.");
                }

                string imageUrl = $"{request.Scheme}://{request.Host}{request.PathBase}/Images/{uniqueFileName}";

                // Update user's image name with the URL
                user.ImageName = imageUrl;
            }

            // Update user record in the database
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return user;
        }


        public async Task DeleteAsync(string id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<User> PostUserForLogin(User login)
        {
            var testUser = await _context.Users.FindAsync(login.EmailID);

            ////login.Password = BCrypt.Net.BCrypt.HashPassword(login.Password);
            ////Console.WriteLine(login.Password);
            ////Console.WriteLine(testUser.Password);
            if (testUser == null)
            {
                return null;
            }
            if (testUser.EmailID == login.EmailID && BCrypt.Net.BCrypt.Verify(login.Password, testUser.Password))
            {

                return testUser;
            }
            else
            {

                return null;
            }
        }
        public async Task<User> UpdatePassword(UserDTO user)
        {
            var existingUser=_context.Users.Find(user.emailId);
            existingUser.Password= BCrypt.Net.BCrypt.HashPassword(user.password);
            _context.Entry(existingUser).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return existingUser;

        }
    }

}