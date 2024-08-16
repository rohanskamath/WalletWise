using ExpenseTracker.Model.DTO;
using ExpenseTracker.Repository.Implementation;
using ExpenseTracker.Repository.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CatMapUsersController : ControllerBase
    {
        private readonly ICatMapUserRepository _repository;

        public CatMapUsersController(ICatMapUserRepository repository)
        {
            _repository = repository;
        }
      
        [HttpPost]
        public async Task<ActionResult<List<CatMapUserDTO>>> AddAsync(List<CatMapUserDTO> cat)
        {
            
            await _repository.AddAsync(cat);

            return Ok(cat);
        }
        [HttpPut]
        public async Task<ActionResult<List<CatMapUserDTO>>> UpdateAsync(List<CatMapUserDTO> cat)
        {
            await _repository.UpdateAsync(cat);
            return Ok(cat);
        }
        [HttpGet]
        public async Task<ActionResult<List<CatMapUserDTO>>> GetAllAsync()
        {
            var catMapUsers = await _repository.GetAllAsync();
            return Ok(catMapUsers);
        }
        [HttpGet("{emailID}")]
        public async Task<ActionResult<List<CatMapUserDTOResponse>>> GetByEmailAsync(string emailID)
        {
            var catMapUsers = await _repository.GetByEmailAsync(emailID);
            if (catMapUsers == null)
            {
                return Accepted("application/json", "No records Found.");
            }
            return Ok(catMapUsers);
        }

    }
}
