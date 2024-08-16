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
    public class ExpenseRepository : IExpenseRepository
    {
        private readonly ExpenseTrackerDbContext _context;

        public ExpenseRepository(ExpenseTrackerDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Expense>> GetByEmailAsync(string email)
        {
            return await _context.Expenses.Include(e => e.User)
                                          .Include(e => e.Account)
                                          .Where(e => e.EmailID == email)
                                          .ToListAsync();
        }

        public async Task<ExpenseDTO> AddAsync(ExpenseDTO expenseDto)
        {
            var account = await _context.Accounts.FirstOrDefaultAsync(a => a.AccountNo == expenseDto.AccountNo);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.EmailID == expenseDto.EmailId);
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.CategoryId == expenseDto.CategoryId); // Load the Category

            if (account == null)
            {
                throw new Exception("Invalid AccountNo");
            }

            if (user == null)
            {
                throw new Exception("Invalid EmailId");
            }

            if (category == null)
            {
                throw new Exception("Invalid CategoryId");
            }
            if (account.Balance < expenseDto.Amount)
            {
                return null;
            }

                var expense = new Expense
            {
                ExpenseDate = expenseDto.ExpenseDate.ToUniversalTime(),
                Amount = expenseDto.Amount,
                Remarks = expenseDto.Remarks,
                Account = account,
                //EmailID = expenseDto.EmailId,
                User = user,
                //CategoryId = expenseDto.CategoryId,
                Category = category,
                NewBalance = account.Balance - expenseDto.Amount
            };

            account.Balance -= expenseDto.Amount;
            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();

            expenseDto.ExpenseId = expense.ExpenseId;
            expenseDto.NewBalance = expense.NewBalance;
            return expenseDto;
        }

        public async Task<ExpenseDTO> UpdateAsync(ExpenseDTO expenseDto)
        {
            var expense = await _context.Expenses.Include(e => e.Account).Include(e => e.User).FirstOrDefaultAsync(e => e.ExpenseId == expenseDto.ExpenseId);

            if (expense == null)
            {
                throw new Exception("Expense not found");
            }

            var account = await _context.Accounts.FirstOrDefaultAsync(a => a.AccountNo == expenseDto.AccountNo);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.EmailID == expenseDto.EmailId);
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.CategoryId == expenseDto.CategoryId); // Load the Category

            if (account == null)
            {
                throw new Exception("Invalid AccountNo");
            }

            if (user == null)
            {
                throw new Exception("Invalid EmailId");
            }

            if (category == null)
            {
                throw new Exception("Invalid CategoryId");
            }

            // Reverse the balance update for the old amount
            account.Balance += expense.Amount;

            // Update the expense entity
            expense.ExpenseDate = expenseDto.ExpenseDate.ToUniversalTime();
            expense.Amount = expenseDto.Amount;
            expense.Remarks = expenseDto.Remarks;
            expense.Account = account;
            expense.User = user;
            //expense.CategoryId = expenseDto.CategoryId;
            expense.Category = category; // Set the Category object
            expense.NewBalance = account.Balance - expenseDto.Amount;

            // Update the account balance with the new amount
            account.Balance -= expenseDto.Amount;

            await _context.SaveChangesAsync();

            expenseDto.NewBalance = expense.NewBalance;
            return expenseDto;
        }
       
    }
}
