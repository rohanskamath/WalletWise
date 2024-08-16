using ExpenseTracker.Model;
using ExpenseTracker.Model.DTO;

namespace ExpenseTracker.Repository.Interfaces
{
    public interface IExpenseRepository
    {
        Task<IEnumerable<Expense>> GetByEmailAsync(string email);
        Task<ExpenseDTO> AddAsync(ExpenseDTO income);
        Task<ExpenseDTO> UpdateAsync(ExpenseDTO income);
    }

}
