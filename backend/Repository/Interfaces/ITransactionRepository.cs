using System.Collections.Generic;
using System.Threading.Tasks;
using ExpenseTracker.Model.DTO;

namespace ExpenseTracker.Repository.Interfaces
{
    public interface ITransactionRepository
    {
        Task<IEnumerable<TransactionDTO>> GetTransactionsAsync(string email);
    }
}
