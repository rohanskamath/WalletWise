using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ExpenseTracker.Data;
using ExpenseTracker.Model.DTO;
using ExpenseTracker.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Repository.Implementation
{
    public class TransactionRepository : ITransactionRepository
    {
        private readonly ExpenseTrackerDbContext _context;

        public TransactionRepository(ExpenseTrackerDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TransactionDTO>> GetTransactionsAsync(string email)
        {
            var istTimeZone = TimeZoneInfo.FindSystemTimeZoneById("India Standard Time");

            // Retrieve and transform incomes
            var incomes = await _context.Incomes
                .Where(i => i.EmailID == email)
                .Join(_context.Accounts,
                    income => income.AccountNo,
                    account => account.AccountNo,
                    (income, account) => new TransactionDTO
                    {
                        TransactionId = income.IncomeId,
                        Date = income.IncomeDate,
                        FormattedDate = TimeZoneInfo.ConvertTimeFromUtc(income.IncomeDate, istTimeZone).ToString("yyyy-MM-dd"),
                        Amount = income.Amount,
                        NewBalance = income.NewBalance,
                        Remarks = income.Remarks,
                        AccountNo = income.AccountNo,
                        EmailId = income.EmailID,
                        Type = "Income",
                        BankName = account.BankName
                    })
                .ToListAsync();

            // Retrieve and transform expenses
            var expenses = await _context.Expenses
                .Where(e => e.EmailID == email)
                .Join(_context.Accounts,
                    expense => expense.AccountNo,
                    account => account.AccountNo,
                    (expense, account) => new TransactionDTO
                    {
                        TransactionId = expense.ExpenseId,
                        Date = expense.ExpenseDate,
                        FormattedDate = TimeZoneInfo.ConvertTimeFromUtc(expense.ExpenseDate, istTimeZone).ToString("yyyy-MM-dd"),
                        Amount = expense.Amount,
                        NewBalance = expense.NewBalance,
                        Remarks = expense.Remarks,
                        AccountNo = expense.AccountNo,
                        EmailId = expense.EmailID,
                        Type = "Expense",
                        CategoryId = expense.CategoryId,
                        CategoryName = expense.Category.CategoryName,
                        BankName = account.BankName
                    })
                .ToListAsync();

            // Combine and sort transactions in-memory
            var transactions = incomes.Concat(expenses)
                .OrderByDescending(t => t.Date)  // Sort by date, latest first
                .ToList();

            return transactions;
        }


    }
}