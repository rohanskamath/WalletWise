using System.ComponentModel.DataAnnotations.Schema;

namespace ExpenseTracker.Model
{
    public class CatMapUser
    {
        [ForeignKey("CategoryId")]
        public int CategoryId { get; set; }
        public Category category { get; set; }

        [ForeignKey("EmailID")]
        public string EmailID { get; set; }
        public User User { get; set; }
       

    }
}
