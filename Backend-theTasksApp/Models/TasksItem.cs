using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace theTasksApp.Models
{
	public class TaskItem
	{
		public int Id { get; set; }

		public string? Title { get; set; }
		public string? Description { get; set; }

		[ValidStatus(ErrorMessage = "O status fornecido não é válido.")]
		public string Status { get; set; } = "Pendente";

		public string CreatedBy { get; set; } = string.Empty;
		public string UpdatedBy { get; set; } = string.Empty;

		public static readonly List<string> ValidStatuses = new() { "Pendente", "Em Progresso", "Concluída" };
	}


	public class ValidStatusAttribute : ValidationAttribute
	{
		public override bool IsValid(object? value)
		{
			if (value is string status)
			{
				return TaskItem.ValidStatuses.Contains(status);
			}
			return false;
		}
	}
}