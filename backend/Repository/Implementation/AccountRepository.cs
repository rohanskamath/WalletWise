
using ExpenseTracker.Data;

using ExpenseTracker.Model;
using ExpenseTracker.Model.DTO;
using ExpenseTracker.Repository.Interfaces;
using Humanizer;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Runtime;
using System.Security.Principal;

namespace ExpenseTracker.Repository.Implementation
{
    public class AccountRepository : IAccountRepository

    {
        private readonly ExpenseTrackerDbContext _context;
        private readonly IIncomeRepository _incomeRepository;

        public AccountRepository(ExpenseTrackerDbContext context, IIncomeRepository incomeRepository)
        {
            _context = context;
            _incomeRepository=incomeRepository;
        }

        public async Task<AccountDTO> AddAsync(AccountDTO accountDto)
        {
            var existingUser = await _context.Users
                    .FirstOrDefaultAsync(u => u.EmailID == accountDto.EmailID);

            if (existingUser == null)
            {
                return null; // Return null or throw exception as needed
            }

            var existingAccount = await _context.Accounts
                   .FirstOrDefaultAsync(a => a.AccountNo == accountDto.AccountNo);

            if (existingAccount == null)
            {
                // Create new account
                var newAccount = new Account
                {
                    AccountNo = accountDto.AccountNo,
                    Balance = 0,
                    BankName = accountDto.BankName,
                    BranchName = accountDto.BranchName,
                    User = existingUser
                };

                _context.Accounts.Add(newAccount);
                await _context.SaveChangesAsync();

                // Add income record for initial balance if necessary
                if (accountDto.Balance > 0)
                {
                    var incomeDto = new IncomeDTO
                    {
                        IncomeDate = DateTime.UtcNow, // Example: using UTC time for consistency
                        amount = accountDto.Balance,
                        remarks = "Account Added",
                        EmailId = accountDto.EmailID,
                        AccountNo = accountDto.AccountNo
                    };

                    await _incomeRepository.AddAsync(incomeDto);
                }

                return accountDto;
            }
            else
            {
                // Handle existing account scenario (return null, throw exception, etc.)
                return null;
            }
        }

        public async Task<AccountDTO> UpdateAsync(AccountDTO account)
        {
            var existingUser = await _context.Users
                      .FirstOrDefaultAsync(acc => acc.EmailID == account.EmailID);
            
            var accountToUpdate = new Account
            {
                AccountNo = account.AccountNo,
                BranchName = account.BranchName,
                BankName = account.BankName,
                Balance= account.Balance,
                User = existingUser
            };
            _context.Entry(accountToUpdate).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return account;
        }
        public async Task<Account> DeleteAsync(string EmailId, string accountNo)
        {
            var existingAccount = await _context.Accounts
                   .FirstOrDefaultAsync(acc => acc.AccountNo == accountNo && acc.UserId == EmailId);

            if (existingAccount != null)
            {
                _context.Accounts.Remove(existingAccount);
                await _context.SaveChangesAsync();
                return existingAccount;
            }
            return null;
           
        }

        public async Task<IEnumerable<Account>> GetAllAsync(string EmailId)
        {
            List<Account> accounts = await _context.Accounts
                                    .Where(acc => acc.UserId == EmailId)
                                    .ToListAsync();
            return accounts;
        }
        public async Task<Account> GetAsync(string EmailId, string accountNo)
        {
            var existingAccount = await _context.Accounts
                   .FirstOrDefaultAsync(acc => acc.AccountNo == accountNo && acc.UserId == EmailId);

            if (existingAccount != null)
            {
                return existingAccount;
            }
            else
            {
                return null;
            }
        }
        public async Task<float> GetTotalBalance(string emailId)
        {
            var totalBalance = await _context.Accounts
                .Where(acc => acc.UserId == emailId)
                .SumAsync(acc => acc.Balance);

            return totalBalance;
        }

       
    }
}
