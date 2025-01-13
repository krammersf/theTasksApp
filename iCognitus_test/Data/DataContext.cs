using Microsoft.EntityFrameworkCore;
using TaskApi.Models;

namespace TaskApi.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        // Tornando a propriedade anulável para evitar o erro CS8618
        public DbSet<TaskItem>? Tasks { get; set; }
    }
}