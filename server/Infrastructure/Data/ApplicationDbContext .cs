using EmployeeAPI.Domains.Entities;
using Microsoft.EntityFrameworkCore;

namespace EmployeeAPI.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Phone> Phones { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Configurando relacionamento entre Employee e Phone
            modelBuilder.Entity<Phone>()
                .HasOne(p => p.Employee)
                .WithMany(e => e.Phones)
                .HasForeignKey(p => p.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade);
            
            // Configurando relacionamento entre Employee e Manager
            modelBuilder.Entity<Employee>()
                .HasOne(e => e.Manager)
                .WithMany(e => e.Subordinates)
                .HasForeignKey(e => e.ManagerId)
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired(false);
            
            // Configurando DocumentNumber como único
            modelBuilder.Entity<Employee>()
                .HasIndex(e => e.DocumentNumber)
                .IsUnique();
            
            // Configurando Email como único
            modelBuilder.Entity<Employee>()
                .HasIndex(e => e.Email)
                .IsUnique();
        }
    }
}