namespace TaskApi.Models
{
    public class TaskItem
    {
        public int Id { get; set; }

        public string? Title { get; set; }
        public string? Description { get; set; }

        public static readonly List<string> ValidStatuses = new List<string> { "Pendente", "Em Progresso", "Concluída" };

        public string Status { get; set; } = "Pendente"; 
    }
}