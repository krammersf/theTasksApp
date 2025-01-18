using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using iCognitus_test.Data;
using iCognitus_test.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace iCognitus_test.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AuthController : ControllerBase
	{
		private readonly DataContext _context;
		private readonly IConfiguration _configuration;
		private readonly ILogger<AuthController> _logger;

		public AuthController(DataContext context, IConfiguration configuration, ILogger<AuthController> logger)
		{
			_context = context;
			_configuration = configuration;
			_logger = logger;
		}

		// POST: api/auth/register
		[HttpPost("register")]
		public async Task<ActionResult<User>> Register(UserDto userDto)
		{
			_logger.LogInformation("Iniciando o processo de registro do usuário: {Email}", userDto.Email);

			// Verificação manual dos campos obrigatórios
			if (string.IsNullOrWhiteSpace(userDto.Email) ||
				string.IsNullOrWhiteSpace(userDto.Password) ||
				string.IsNullOrWhiteSpace(userDto.Username))
			{
				_logger.LogWarning("Tentativa de registro com campos ausentes.");
				return BadRequest("All fields must be filled: Email, Username, and Password.");
			}

			if (!ModelState.IsValid)
			{
				_logger.LogWarning("ModelState inválido ao tentar registrar o usuário: {Email}", userDto.Email);
				return BadRequest(ModelState);
			}

			if (_context.Users == null)
			{
				_logger.LogError("Tabela de Users não está disponível.");
				return BadRequest("Users table is not available.");
			}

			var existingUser = await _context.Users.SingleOrDefaultAsync(u => u.Email == userDto.Email);
			if (existingUser != null)
			{
				_logger.LogWarning("Email já existe: {Email}", userDto.Email);
				return BadRequest("Email already exists.");
			}

			var user = new User
			{
				Email = userDto.Email,
				Password = BCrypt.Net.BCrypt.HashPassword(userDto.Password),
				Username = userDto.Username
			};

			_context.Users.Add(user);
			await _context.SaveChangesAsync();

			_logger.LogInformation("Usuário registrado com sucesso: {Username}", user.Username);
			return CreatedAtAction(nameof(Register), new { id = user.Id }, user);
		}

		// POST: api/auth/login
		[HttpPost("login")]
		public async Task<IActionResult> Login(LoginDto loginDto)
		{
			_logger.LogInformation("Tentando autenticar o usuário: {Email}", loginDto.Email);

			if (_context.Users == null)
			{
				_logger.LogError("Tabela de Users não está disponível.");
				return BadRequest("Users table is not available.");
			}

			var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == loginDto.Email);

			if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
			{
				_logger.LogWarning("Falha na autenticação para o usuário: {Email}", loginDto.Email);
				return Unauthorized();
			}

			_logger.LogInformation("Usuário autenticado com sucesso: {Email}", loginDto.Email);
			var token = GenerateJwtToken(user);

			_logger.LogInformation("Token gerado para o usuário: {Email}", loginDto.Email);
			return Ok(new { token });
		}

		private string GenerateJwtToken(User user)
		{
			_logger.LogInformation("Gerando token JWT para o usuário: {Username}", user.Username);

			var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not found.")));
			var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

			var claims = new[]
			{
				new Claim(JwtRegisteredClaimNames.Sub, user.Email),
				new Claim("username", user.Username),
				new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
			};

			var token = new JwtSecurityToken(
				issuer: _configuration["Jwt:Issuer"],
				audience: _configuration["Jwt:Audience"],
				claims: claims,
				expires: DateTime.Now.AddMinutes(300),
				signingCredentials: credentials);

			var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

			_logger.LogInformation("Token gerado com sucesso para o usuário: {Username}", user.Username);

			return tokenString;
		}
	}
}