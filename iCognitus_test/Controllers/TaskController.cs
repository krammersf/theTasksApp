using Microsoft.AspNetCore.Mvc;
using iCognitus_test.Data;
using iCognitus_test.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization; 

namespace TaskItem.Controllers
{
	[Route("tasks")]
	[ApiController]
	[Authorize] 
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
			var tasks = await (_context.Tasks?.ToListAsync() ?? Task.FromResult(new List<iCognitus_test.Models.TaskItem>()));
			return Ok(tasks);
		}

        // GET /tasks/pendentes -> Apenas tarefas pendentes
        [HttpGet("pendentes")]
        public async Task<IActionResult> GetPendentes()
        {
            if (_context.Tasks == null) return NotFound("A base de dados está vazia.");
            
            var pendentes = await _context.Tasks
                .Where(t => t.Status == "Pendente")
                .ToListAsync();
            
            return Ok(pendentes);
        }

		// GET /tasks/emprogresso -> Apenas tarefas em progresso
        [HttpGet("emprogresso")]
        public async Task<IActionResult> GetEmProgresso()
        {
            if (_context.Tasks == null) return NotFound("A base de dados está vazia.");
            
            var pendentes = await _context.Tasks
                .Where(t => t.Status == "Em Progresso")
                .ToListAsync();
            
            return Ok(pendentes);
        }

		// GET /tasks/concluida -> Apenas tarefas concluidas
        [HttpGet("Concluida")]
        public async Task<IActionResult> GetConcluida()
        {
            if (_context.Tasks == null) return NotFound("A base de dados está vazia.");
            
            var pendentes = await _context.Tasks
                .Where(t => t.Status == "Concluída")
                .ToListAsync();
            
            return Ok(pendentes);
        }

		// GET /tasks/{id}
		[HttpGet("{id}")]
		public async Task<IActionResult> GetTask(int id)
		{
			if (_context.Tasks == null) return NotFound();
			if (_context.Tasks == null) return NotFound("A base de dados está vazia.");
			var task = await _context.Tasks.FindAsync(id);
			if (task == null) return NotFound();
			return Ok(task);
		}

		// POST /tasks
		[HttpPost]
		public async Task<IActionResult> CreateTask([FromBody] iCognitus_test.Models.TaskItem taskItem)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			if (taskItem.Status == null || !iCognitus_test.Models.TaskItem.ValidStatuses.Contains(taskItem.Status))
			{
				return base.BadRequest("Status inválido. Valores permitidos: Pendente, Em Progresso, Concluída.");
			}

			if (_context.Tasks == null)
			{
				return Problem("Entity set 'DataContext.Tasks' is null.");
			}

			var username = User?.Identity?.Name;
			if (string.IsNullOrEmpty(username))  // Se o username for nulo ou vazio
			{
				return Unauthorized("Utilizador não autenticado.");
			}

			taskItem.CreatedBy = username;
			taskItem.UpdatedBy = username;

			_context.Tasks.Add(taskItem);
			await _context.SaveChangesAsync();
			return CreatedAtAction(nameof(GetTask), new { id = taskItem.Id }, taskItem);
		}

		// PUT /tasks/{id}
		[HttpPut("{id}")]
		public async Task<IActionResult> UpdateTask(int id, [FromBody] iCognitus_test.Models.TaskItem updatedTask)
		{
			if (!ModelState.IsValid) return BadRequest(ModelState);

			// Verificar se User e Identity não são nulos antes de acessar o Name
			var username = User?.Identity?.Name;
			if (string.IsNullOrEmpty(username))
			{
				return Unauthorized("Utilizador não autenticado.");
			}
			if (_context.Tasks == null) return NotFound();
			// Verifica se a tarefa existe
			var task = await _context.Tasks.FindAsync(id);
			if (task == null) return NotFound("Tarefa não encontrada.");

			// Atualizar os campos da tarefa
			task.Title = updatedTask.Title;
			task.Description = updatedTask.Description;
			task.Status = updatedTask.Status;

			// Atualizar o campo UpdatedBy
			task.UpdatedBy = username;

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