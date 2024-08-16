using ExpenseTracker.Model;
using ExpenseTracker.Model.DTO;

namespace ExpenseTracker.Repository.Interfaces
{
    public interface IIncomeRepository
    {
        Task<IEnumerable<Income>> GetByEmailAsync(string email);
        Task <IncomeDTO> AddAsync(IncomeDTO income);
        Task<IncomeDTO>UpdateAsync(IncomeDTO income);


    }
}
