using System.ComponentModel.DataAnnotations;
using EmployeeAPI.Domains.Enums;

namespace EmployeeAPI.Domains.Entities
{
    public class Employee
    {
        public int Id { get; set; }
        
        [Required]
        public string FirstName { get; set; }
        
        [Required]
        public string LastName { get; set; }
        
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        
        [Required]
        public string DocumentNumber { get; set; }
        
        public List<Phone> Phones { get; set; } = [];
        
        public int? ManagerId { get; set; }
        public Employee Manager { get; set; }
        
        public ICollection<Employee> Subordinates { get; set; } = new List<Employee>();
        
        [Required]
        public string PasswordHash { get; set; }
        
        public string PasswordSalt { get; set; }
        
        [Required]
        public DateTime BirthDate { get; set; }
        
        [Required]
        public Role Role { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        
        public DateTime? UpdatedAt { get; set; }
        
        public string FullName => $"{FirstName} {LastName}";
        
        public bool IsAdult => DateTime.Now.AddYears(-18) >= BirthDate;
    }
}