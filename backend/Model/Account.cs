using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExpenseTracker.Model
{
    public class Account
    {
        [Key]
        public string AccountNo { get; set; }
        public string BankName { get; set; }
        public string BranchName { get; set; }
        public float Balance { get; set; }

        [ForeignKey("User")]
        public string UserId { get; set; }
        public User User { get; set; }

       
    }
}
