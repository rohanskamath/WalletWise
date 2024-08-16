using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ExpenseTracker.Data;
using ExpenseTracker.Model;
using ExpenseTracker.Repository.Interfaces;
using ExpenseTracker.Repository.Implementation;
using Humanizer;
using ExpenseTracker.Model.DTO;

namespace ExpenseTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserAuthController : ControllerBase
    {
        private readonly IUserRepository _repository;

        public UserAuthController(IUserRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            var user = await _repository.GetAllAsync();
            return Ok(user);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUserById(string id)
        {
            var user = await _repository.GetByIdAsync(id);
            if (user == null)
            {
                return Ok("Check your email and password or create an account.");
            }
            return Ok(user);
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> PostUser(User user)
        {

            var existingUser = await _repository.GetByIdAsync(user.EmailID);
            if (existingUser != null)
            {
                return Ok("Email already exists.");
            }
            var newUser = await _repository.AddAsync(user);
            return CreatedAtAction(nameof(GetUserById), new { id = newUser.EmailID }, newUser);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromForm] UserDTO userDTO, IFormFile? imageFile)
        {
            var existingUser = await _repository.GetByIdAsync(id);
            if (existingUser == null)
            {
                return NotFound();
            }

            // Map the DTO to the User entity
            existingUser.FullName = userDTO.FullName;
            existingUser.Occupation = userDTO.Occupation;
            existingUser.MonthlyIncome = userDTO.MonthlyIncome;
            // Other properties you want to update...

            // Update the user and handle the image file if provided
            var updatedUser = await _repository.UpdateAsync(existingUser, imageFile);

            return Ok(updatedUser);
        }
   

    [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _repository.GetByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            await _repository.DeleteAsync(id);

            return NoContent();
        }

        [HttpPost("login")]
        public async Task<ActionResult<User>> CheckLogin(User login)
        {
            {
                var user = await _repository.PostUserForLogin(login);
                if (user == null)
                {
                    return Accepted("application/json", "Invalid Email ID or Password");
                }
                else
                {
                    return Ok(user);
                }

            }
        }
        
        [HttpPut("ChangePassword")]
        public async Task<IActionResult> PutPassword(UserDTO user)
        {

            try
            {
               var existingUser= await _repository.UpdatePassword(user);
                if (existingUser != null)
                {
                    return Accepted("application/json", "Password Changed Sucessfully");
                }
                else
                {
                    return Accepted("application/json", "Error Occured");
                }

            }
            catch (DbUpdateConcurrencyException)
            {
                if (await _repository.GetByIdAsync(user.emailId) == null)
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }
    }
}