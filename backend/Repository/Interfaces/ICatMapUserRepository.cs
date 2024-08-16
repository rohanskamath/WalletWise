using ExpenseTracker.Model.DTO;

namespace ExpenseTracker.Repository.Interfaces
{
    public interface ICatMapUserRepository
    {
        Task<List<CatMapUserDTO>> AddAsync(List<CatMapUserDTO> cat);
        Task<List<CatMapUserDTO>> GetAllAsync();
        Task<List<CatMapUserDTOResponse>> GetByEmailAsync(string emailID);
        Task<List<CatMapUserDTO>> UpdateAsync(List<CatMapUserDTO> cat);

    }
}
