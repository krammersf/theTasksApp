using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using iCognitus_test.Data;
using iCognitus_test.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace iCognitus_test.Controllers
{
	[Route("api/[controller]")]
	[ApiController]

	public class AuthController : ControllerBase
	{
		private readonly DataContext _context;
		private readonly IConfiguration _configuration;

		public AuthController(DataContext context, IConfiguration configuration)
		{
			_context = context;
			_configuration = configuration;
		}

		// POST: api/auth/register
		[HttpPost("register")]
		public async Task<ActionResult<User>> Register(UserDto userDto)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}
			
			if (_context.Users == null)
			{
				return BadRequest("Users table is not available.");
			}

			var existingUser = await _context.Users.SingleOrDefaultAsync(u => u.Email == userDto.Email);
			if (existingUser != null)
			{
				return BadRequest("Email already exists");
			}

			var user = new User
			{
				Email = userDto.Email,
				Password = BCrypt.Net.BCrypt.HashPassword(userDto.Password),
				Username = userDto.Username 
			};

			_context.Users.Add(user);
			await _context.SaveChangesAsync();

			return CreatedAtAction(nameof(Register), new { id = user.Id }, user);
		}

		// POST: api/auth/login
		[HttpPost("login")]
		public async Task<IActionResult> Login(LoginDto loginDto)
		{
			if (_context.Users == null)
			{
				return BadRequest("Users table is not available.");
			}

			var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == loginDto.Email);

			if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
			{
				return Unauthorized();
			}

			var token = GenerateJwtToken(user);

			return Ok(new { token });
		}

		private string GenerateJwtToken(User user)
		{
			var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not found.")));
			var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

			var claims = new[]
			{
				new Claim(JwtRegisteredClaimNames.Sub, user.Email),
				new Claim("username", user.Username),
				//new Claim("id", user.Id.ToString()),  
				new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
			};

			var token = new JwtSecurityToken(
				issuer: _configuration["Jwt:Issuer"],
				audience: _configuration["Jwt:Audience"],
				claims: claims,
				expires: DateTime.Now.AddMinutes(300),
				signingCredentials: credentials);

			return new JwtSecurityTokenHandler().WriteToken(token);
		}
		
	}
}