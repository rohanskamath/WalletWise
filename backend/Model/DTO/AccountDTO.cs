using System.ComponentModel.DataAnnotations;

namespace ExpenseTracker.Model.DTO
{
    public class AccountDTO
    { 
        public string AccountNo { get; set; }
        public string BankName { get; set; }
        public string BranchName { get; set; }
        public float Balance { get; set; }
        public string EmailID { get; set; }
     }
}
