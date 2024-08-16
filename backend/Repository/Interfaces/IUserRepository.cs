using ExpenseTracker.Model;
using ExpenseTracker.Model.DTO;

namespace ExpenseTracker.Repository.Interfaces
{
    public interface IUserRepository
    {

        Task<IEnumerable<User>> GetAllAsync();
        Task<User> AddAsync(User user);
        Task<User> GetByIdAsync(string id);
        Task<User> UpdateAsync(User user, IFormFile imageFile);
        Task DeleteAsync(string id);
        Task<User> PostUserForLogin(User login);
        Task<User> AddSocialAsync(User user);
        Task<User> UpdatePassword(UserDTO user);
    }
}

