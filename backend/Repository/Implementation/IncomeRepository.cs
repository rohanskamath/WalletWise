using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ExpenseTracker.Data;
using ExpenseTracker.Model;
using ExpenseTracker.Model.DTO;
using ExpenseTracker.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Repository.Implementation
{
    public class IncomeRepository : IIncomeRepository
    {
        private readonly ExpenseTrackerDbContext _context;

        public IncomeRepository(ExpenseTrackerDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Income>> GetByEmailAsync(string email)
        {
            return await _context.Incomes.Include(i => i.User)
                                         .Include(i => i.Account)
                                         .Where(i => i.EmailID == email)
                                         .ToListAsync();
        }

        public async Task<IncomeDTO> AddAsync(IncomeDTO incomeDto)
        {
            var account = await _context.Accounts.FirstOrDefaultAsync(a => a.AccountNo == incomeDto.AccountNo);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.EmailID == incomeDto.EmailId);

            if (account == null)
            {
                throw new Exception("Invalid AccountNo");
            }

            if (user == null)
            {
                throw new Exception("Invalid EmailId");
            }

            var income = new Income
            {
                IncomeDate = incomeDto.IncomeDate.ToUniversalTime(),
                Amount = incomeDto.amount,
                Remarks = incomeDto.remarks,
                Account = account,
                //EmailID = incomeDto.EmailId,
                User = user,
                NewBalance = account.Balance + incomeDto.amount
            };

            account.Balance += incomeDto.amount;
            _context.Incomes.Add(income);
            await _context.SaveChangesAsync();

            incomeDto.IncomeId = income.IncomeId;
            incomeDto.NewBalance = income.NewBalance;
            return incomeDto;
        }

        public async Task<IncomeDTO> UpdateAsync(IncomeDTO incomeDto)
        {
            var income = await _context.Incomes.Include(i => i.Account).Include(i => i.User)
                                               .FirstOrDefaultAsync(i => i.IncomeId == incomeDto.IncomeId);

            if (income == null)
            {
                throw new Exception("Income not found");
            }

            var account = await _context.Accounts.FirstOrDefaultAsync(a => a.AccountNo == incomeDto.AccountNo);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.EmailID == incomeDto.EmailId);

            if (account == null)
            {
                throw new Exception("Invalid AccountNo");
            }

            if (user == null)
            {
                throw new Exception("Invalid EmailId");
            }

            // Reverse the balance update for the old amount
            account.Balance -= income.Amount;

            income.IncomeDate = incomeDto.IncomeDate.ToUniversalTime();
            income.Amount = incomeDto.amount;
            income.Remarks = incomeDto.remarks;
            income.Account = account;
            income.User = user;
            income.NewBalance = account.Balance + incomeDto.amount;

            // Update the account balance with the new amount
            account.Balance += incomeDto.amount;

            await _context.SaveChangesAsync();

            incomeDto.NewBalance = income.NewBalance;
            return incomeDto;
        }
     

    }
}
