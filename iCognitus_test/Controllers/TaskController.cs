using Microsoft.AspNetCore.Mvc;
using iCognitus_test.Data;
using iCognitus_test.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization; 

namespace TaskApi.Controllers
{
	[Route("tasks")]
	[ApiController]
	//[Authorize] 
	public class TasksController : ControllerBase
	{
		private readonly DataContext _context;

		public TasksController(DataContext context)
		{
			_context = context;
		}

		// GET /tasks
		[HttpGet]
		public async Task<IActionResult> GetAllTasks()
		{
			var tasks = await (_context.Tasks?.ToListAsync() ?? Task.FromResult(new List<TaskItem>()));
			return Ok(tasks);
		}

		// GET /tasks/{id}
		[HttpGet("{id}")]
		public async Task<IActionResult> GetTask(int id)
		{
			if (_context.Tasks == null) return NotFound();
			var task = await _context.Tasks.FindAsync(id);
			if (task == null) return NotFound();
			return Ok(task);
		}

		// POST /tasks
		[HttpPost]
		public async Task<IActionResult> CreateTask([FromBody] TaskItem taskItem)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			if (taskItem.Status == null || !TaskItem.ValidStatuses.Contains(taskItem.Status))
			{
				return BadRequest("Status inválido. Valores permitidos: Pendente, Em Progresso, Concluída.");
			}

			if (_context.Tasks == null)
			{
				return Problem("Entity set 'DataContext.Tasks' is null.");
			}

			_context.Tasks.Add(taskItem);
			await _context.SaveChangesAsync();
			return CreatedAtAction(nameof(GetTask), new { id = taskItem.Id }, taskItem);
		}

		// PUT /tasks/{id}
		[HttpPut("{id}")]
		public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskItem updatedTask)
		{
			if (_context.Tasks == null) return NotFound();
			var task = await _context.Tasks.FindAsync(id);
			if (task == null) return NotFound();

			task.Title = updatedTask.Title;
			task.Description = updatedTask.Description;
			task.Status = updatedTask.Status;

			await _context.SaveChangesAsync();
			return Ok(task);
		}

		// DELETE /tasks/{id}
		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteTask(int id)
		{
			if (_context.Tasks == null) return NotFound();
			var task = await _context.Tasks.FindAsync(id);
			if (task == null) return NotFound();

			_context.Tasks.Remove(task);
			await _context.SaveChangesAsync();
			return NoContent();
		}
	}
}