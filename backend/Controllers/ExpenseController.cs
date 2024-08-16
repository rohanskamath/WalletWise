using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ExpenseTracker.Data;
using ExpenseTracker.Model.DTO;
using ExpenseTracker.Repository.Interfaces;
using ExpenseTracker.Model;
using ExpenseTracker.Repository.Implementation;

namespace ExpenseTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExpenseController : ControllerBase
    {
        private readonly IExpenseRepository _expenseRepository;

        public ExpenseController(IExpenseRepository expenseRepository)
        {
            _expenseRepository = expenseRepository;
        }

        [HttpGet("{email}")]
        public async Task<ActionResult<IEnumerable<Expense>>> GetExpensesByEmail(string email)
        {
            var expenses = await _expenseRepository.GetByEmailAsync(email);
            if (expenses == null || !expenses.Any())
            {
                return NotFound();
            }
            return Ok(expenses);
        }

        [HttpPost]
        public async Task<ActionResult> CreateExpense([FromBody] ExpenseDTO expenseDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var createdExpense = await _expenseRepository.AddAsync(expenseDto);
                if(createdExpense==null)
                {
                    return Accepted("application/json","Amount greater than Balance");
                }
                return CreatedAtAction(nameof(GetExpensesByEmail), new { email = createdExpense.EmailId }, createdExpense);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateExpense(int id, [FromBody] ExpenseDTO expenseDto)
        {
            if (id != expenseDto.ExpenseId)
            {
                return BadRequest();
            }

            try
            {
                var updatedExpense = await _expenseRepository.UpdateAsync(expenseDto);
                return Ok(updatedExpense);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        

    }
}
