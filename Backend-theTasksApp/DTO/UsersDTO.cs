using System.ComponentModel.DataAnnotations;

namespace theTasksApp.Models
{
	public class UserDto
	{
		[Required(ErrorMessage = "O nome de utilizador é obrigatório.")]
		public string Username { get; set; } = string.Empty;

		[Required(ErrorMessage = "O email é obrigatório.")]
		[EmailAddress(ErrorMessage = "O formato do email é inválido.")]
		public string Email { get; set; } = string.Empty;

		[Required(ErrorMessage = "A palavra-passe é obrigatória.")]
		public string Password { get; set; } = string.Empty;
	}


	public class LoginDto
	{
		public required string Email { get; set; }
		public required string Password { get; set; }
	}
}