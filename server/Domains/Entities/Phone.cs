using System.ComponentModel.DataAnnotations;

namespace EmployeeAPI.Domains.Entities
{
    public class Phone
    {
        public int Id { get; set; }
        
        [Required]
        public string Number { get; set; }
        
        public string Type { get; set; } = "Mobile"; // Mobile, Home, Work
        
        public int EmployeeId { get; set; }
        public Employee Employee { get; set; }
    }
}