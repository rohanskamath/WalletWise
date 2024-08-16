namespace ExpenseTracker.Model.DTO
{
    public class IncomeDTO
    {
        public int IncomeId { get; set; }
        public DateTime IncomeDate { get; set; }
        public float amount { get; set; }
        public float NewBalance {  get; set; }
        public string remarks { get; set; }
        public string AccountNo { get; set; }
        public string EmailId { get; set; }
    }
    public class IncomeResponse
    {
        public float Amount;
    }
}
