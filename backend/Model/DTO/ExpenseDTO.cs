using System.ComponentModel.DataAnnotations;

namespace ExpenseTracker.Model.DTO
{
    public class ExpenseDTO
    {
        public int ExpenseId { get; set; }
        public DateTime ExpenseDate { get; set; }
        public int CategoryId { get; set; }
        public string EmailId { get; set; }
        public string AccountNo { get; set; }
        public string Remarks { get; set; }
        public float Amount { get; set; }
        public float NewBalance { get; set; }
    }
    public class ExpenseResponse
    { 
        public float Amount { get; set; }
    }
}
