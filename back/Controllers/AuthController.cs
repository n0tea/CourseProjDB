using DBSiteNew.ModelsDb;
using DBSiteNew.Services;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Crypto.Generators;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;

namespace DBSiteNew.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IAuthService _authService;

        public AuthController(IUserService userService, IAuthService authService)
        {
            _userService = userService;
            _authService = authService;
        }

        [Authorize]
        [HttpGet("validate-token")]
        public async Task<IActionResult> Validate()
        {
            var bearerToken = Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            if (string.IsNullOrWhiteSpace(bearerToken))
            {
                return BadRequest("Token is missing");
            }

            var handler = new JwtSecurityTokenHandler();
            var token = handler.ReadJwtToken(bearerToken);
            if (token == null)
            {
                return Unauthorized();
            }

            var userIdClaim = token.Claims.FirstOrDefault(c => c.Type == "nameid");//ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized();
            }


            if (!int.TryParse(userIdClaim.Value, out int userId))
            {
                return BadRequest("Invalid user ID in token");
            }
            // из try parse беру
            var user = await _userService.GetUserByIdAsync(userId);

            return Ok(new { user = user });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            var existingUser = await _userService.GetUserByEmailAsync(request.Email);
            if (existingUser != null)
            {
                return BadRequest("User already exists");
            }

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(request.Password) // Hash the password
            };

            await _userService.CreateUserAsync(user);

            return Ok();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var user = await _userService.GetUserByEmailAsync(request.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                return Unauthorized("Invalid credentials");
            }

            var accessToken = _authService.GenerateAccessToken(user);
            var refreshToken = _authService.GenerateRefreshToken();

            await _userService.SaveRefreshTokenAsync(user.Id, refreshToken);

            return Ok(new AuthResponse { AccessToken = accessToken, RefreshToken = refreshToken, UserId = user.Id});
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh(TokenRefreshRequest request)
        {
            var user = await _userService.GetUserByRefreshTokenAsync(request.RefreshToken);
            if (user == null)
            {
                return Unauthorized("Invalid refresh token");
            }

            var accessToken = _authService.GenerateAccessToken(user);
            var newRefreshToken = _authService.GenerateRefreshToken();

            await _userService.SaveRefreshTokenAsync(user.Id, newRefreshToken);

            return Ok(new AuthResponse { AccessToken = accessToken, RefreshToken = newRefreshToken });
        }
    }

    public class RegisterRequest
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class TokenRefreshRequest
    {
        public string RefreshToken { get; set; }
    }

    public class AuthResponse
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public int UserId { get; set; }
    }
}
