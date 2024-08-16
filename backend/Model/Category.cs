using System.ComponentModel.DataAnnotations;

namespace ExpenseTracker.Model
{
    public class Category
    {
        [Key]
        public int CategoryId { get; set; }
        public string CategoryName {  get; set; }
    }
    
}
