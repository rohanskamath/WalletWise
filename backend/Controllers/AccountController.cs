using ExpenseTracker.Model;
using ExpenseTracker.Model.DTO;
using ExpenseTracker.Repository.Implementation;
using ExpenseTracker.Repository.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using NuGet.Protocol;
using System.Collections.Generic;
using System.Runtime.InteropServices;

namespace ExpenseTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountRepository _repository;

        public AccountController(IAccountRepository repository)
        {
            _repository = repository;
          
        }
        [HttpGet("Account")]
        public async Task<ActionResult<Account>> GetAccount(string accountNo, string EmailId) 
        {
            var existingAccount=  await _repository.GetAsync(EmailId, accountNo);
            if (existingAccount != null)
            {
                return Ok(existingAccount); 
            }
            return Accepted("application/json", "Account does not exist");
        }
        [HttpGet("AllAccounts")]
        public async Task<ActionResult<IEnumerable<Account>>> GetAllAccounts(string EmailId)
        {
            var accounts= await _repository.GetAllAsync(EmailId);
            return Ok(accounts);
            
        }
        [HttpPost]
        public async Task<ActionResult<AccountDTO>> AddAsync(AccountDTO account)
        {
            var addedAccount=await _repository.AddAsync(account);
            if (addedAccount != null)
            {
                return Ok(addedAccount);
            }
            else
            {
                return Accepted("application/json","Account already exists");
            }
        }
        [HttpPut("UpdateAccount")]
        public async Task<ActionResult<Account>> UpdateAsync(AccountDTO account)
        {
            var existingAccount = await _repository.UpdateAsync(account);
            return Ok(existingAccount);
        }
        [HttpDelete("DeleteAccount")]
        public async Task<ActionResult<Account>> DeleteAsync(string EmailId,string accountNo)
        {
            var deletedUser= await _repository.DeleteAsync(EmailId,accountNo);
            if (deletedUser != null)
            {
                return Ok(deletedUser);
            }
            return Accepted("application/json","Invalid account details");
        }

        [HttpGet("balance/{email}")]
        public async Task<ActionResult<float>> GetTotalBalance(string email)
        {
            var totalBalance = await _repository.GetTotalBalance(email);

            if (totalBalance == 0)
            {
                return NotFound();
            }

            return Ok(totalBalance);
        }

    }
}
