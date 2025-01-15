using Microsoft.EntityFrameworkCore;
using iCognitus_test.Models;

namespace iCognitus_test.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<Models.TaskItem>? Tasks { get; set; }
        public DbSet<User>? Users { get; set; }
    }
}