using ExpenseTracker.Model;
using ExpenseTracker.Repository.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;

namespace ExpenseTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryRepository _repository;

        public CategoryController(ICategoryRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            var cat = await _repository.GetAllAsync();
            return Ok(cat);
        }
        //[HttpGet("{id}")]
        //public async Task<ActionResult<Category>> GetCatById(int id)
        //{
        //    var cat = await _repository.GetByIdAsync(id);
        //    if (cat == null)
        //    {
        //        return Ok("No categories found");
        //    }
        //    return Ok(cat);
        //}

        [HttpPost("Add")]
        public async Task<ActionResult<Category>> PostUser(Category cat)
        {
            cat.CategoryName = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(cat.CategoryName.ToLower());
            var newCat = await _repository.AddAsync(cat);
            
           if (newCat == null)
            {
                return Ok("Category already exists");
            }
            else 
            {
                return Ok(newCat); 
            }
            
        }



    }
}
