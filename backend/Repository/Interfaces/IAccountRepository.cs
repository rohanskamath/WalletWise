using ExpenseTracker.Model;
using ExpenseTracker.Model.DTO;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTracker.Repository.Interfaces
{
    public interface IAccountRepository
    {
        Task<AccountDTO> AddAsync(AccountDTO acc);
        Task<AccountDTO> UpdateAsync(AccountDTO cat);
        Task<Account> DeleteAsync(string EmailId, string accountNo);
        Task<IEnumerable<Account>> GetAllAsync(string EmailId);
        Task<Account> GetAsync(string EmailId, string accountNo);
        Task<float> GetTotalBalance(string email);

    }
}
