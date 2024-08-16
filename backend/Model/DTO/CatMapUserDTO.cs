namespace ExpenseTracker.Model.DTO
{
    public class CatMapUserDTO
    {
        public int CategoryId { get; set; }
        public string EmailID { get; set; }
    }
    public class CatMapUserDTOResponse
    {
        public int CategoryId { get; set; }
        public string EmailID { get; set; }
        public string CatName { get; set; }
    }
}
