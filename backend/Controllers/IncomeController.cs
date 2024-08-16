using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ExpenseTracker.Data;

using ExpenseTracker.Model;
using ExpenseTracker.Model.DTO;
using ExpenseTracker.Repository.Interfaces;
using ExpenseTracker.Repository.Implementation;

namespace ExpenseTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IncomeController : ControllerBase
    {
        private readonly IIncomeRepository _incomeRepository;

        public IncomeController(IIncomeRepository incomeRepository)
        {
            _incomeRepository = incomeRepository;
        }
        [HttpGet("{email}")]
        public async Task<ActionResult<Income>> GetIncomeByEmail(string email)
        {
            var income = await _incomeRepository.GetByEmailAsync(email);
            if (income == null)
            {
                return NotFound();
            }
            return Ok(income);
        }

        [HttpPost]
        public async Task<ActionResult> CreateIncome([FromBody] IncomeDTO incomeDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var createdIncome = await _incomeRepository.AddAsync(incomeDto);
                return CreatedAtAction(nameof(GetIncomeByEmail), new { email = createdIncome.EmailId }, createdIncome);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateIncome(int id, [FromBody] IncomeDTO incomeDto)
        {
            if (id != incomeDto.IncomeId)
            {
                return BadRequest();
            }

            try
            {
                var updatedIncome = await _incomeRepository.UpdateAsync(incomeDto);
                return Ok(updatedIncome);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
    }
}
