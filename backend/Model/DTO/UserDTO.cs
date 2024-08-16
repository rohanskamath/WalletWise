namespace ExpenseTracker.Model.DTO
{
    public class UserDTO
    {
        public string emailId { get; set; }
        public string? FullName { get; set; }
        public string? Occupation { get; set; }
        public int MonthlyIncome {  get; set; }
        public string? password { get; set; }
    }
}
