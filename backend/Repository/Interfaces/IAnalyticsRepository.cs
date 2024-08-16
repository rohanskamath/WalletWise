using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace ExpenseTracker.Repository.Interfaces
{
    public interface IAnalyticsRepository
    {
        Task<float> GetTotalExpenseTodayAsync(string email, DateTime date);
        Task<float> GetTotalIncomeTodayAsync(string email, DateTime date);
        Task<float> GetTotalExpenseThisWeekAsync(string email,DateTime date);
        Task<float> GetTotalIncomeThisWeekAsync(string email, DateTime date);
        Task<float> GetTotalExpenseByMonthAsync(string email, int year, int month);
        Task<float> GetTotalIncomeByMonthAsync(string email, int year, int month);
        Task<float> GetTotalExpenseThisYearAsync(string email,int year);
        Task<float> GetTotalIncomeThisYearAsync(string email, int year);

        Task<IEnumerable<KeyValuePair<string, float>>> GetTotalExpenseByCategoryTodayAsync(string email, DateTime date);
        Task<IEnumerable<KeyValuePair<string, float>>> GetTotalExpenseByCategoryThisWeekAsync(string email, DateTime date);
        Task<IEnumerable<KeyValuePair<string, float>>> GetTotalExpenseByCategoryThisMonthAsync(string email, int month, int year);
        Task<IEnumerable<KeyValuePair<string, float>>> GetTotalExpenseByCategoryThisYearAsync(string email,int year);
        Task<(List<float> incomes, List<float> expenses, List<DateTime> dates)> GetWeeklyReportAsync(string email, DateTime date);

    }
}
