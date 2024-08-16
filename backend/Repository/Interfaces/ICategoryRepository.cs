using ExpenseTracker.Model;

namespace ExpenseTracker.Repository.Interfaces
{
    public interface ICategoryRepository
    {
        Task<IEnumerable<Category>> GetAllAsync();
        Task<Category> AddAsync(Category cat);
        Task<Category> GetByIdAsync(int id);
    }
}
