using DBSiteNew.Data;
using DBSiteNew.ModelsDb;
using Microsoft.EntityFrameworkCore;

namespace DBSiteNew.Services
{
    public interface IUserService
    {
        Task<User> GetUserByEmailAsync(string email);
        Task<User> GetUserByIdAsync(int id);
        Task CreateUserAsync(User user);
        Task SaveRefreshTokenAsync(int userId, string refreshToken);
        Task<User> GetUserByRefreshTokenAsync(string refreshToken);
    }

    public class UserService : IUserService
    {
        private readonly AppDbSiteContext _context;

        public UserService(AppDbSiteContext context)
        {
            _context = context;
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            return await _context.Users.SingleOrDefaultAsync(u => u.Email == email);
        }
        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _context.Users.SingleOrDefaultAsync(u => u.Id == id);
        }

        public async Task CreateUserAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        public async Task SaveRefreshTokenAsync(int userId, string refreshToken)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user != null)
            {
                user.RefreshToken = refreshToken;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<User> GetUserByRefreshTokenAsync(string refreshToken)
        {
            return await _context.Users.SingleOrDefaultAsync(u => u.RefreshToken == refreshToken);
        }
    }
}
