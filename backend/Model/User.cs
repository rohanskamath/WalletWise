using System.ComponentModel.DataAnnotations;

namespace ExpenseTracker.Model
{
    public class User
    {
        [Key]
        public string EmailID { get; set; }
        public string? FullName { get; set; }
        public string? Password { get; set; }
        public string? Occupation { get; set; }
        public int MonthlyIncome { get; set; } = 0;
        public DateTime CreatedDate { get; set; }
        public string? ImageName { get; set; }

 
    }
}
