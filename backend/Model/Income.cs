using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExpenseTracker.Model
{
    public class Income
    {
        [Key]
        public int IncomeId { get; set; }
        public DateTime IncomeDate { get; set; }
        public float Amount { get; set; }
        public float NewBalance { get; set; }
        public string Remarks { get; set; }

        public string EmailID { get; set; }  // Foreign key
        [ForeignKey("EmailID")]
        public User User { get; set; }

        public string AccountNo { get; set; }  // Foreign key
        [ForeignKey("AccountNo")]
        public Account Account { get; set; }
    }
}
