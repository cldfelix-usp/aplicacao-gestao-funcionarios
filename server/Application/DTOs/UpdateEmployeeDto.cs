using System.ComponentModel.DataAnnotations;
using EmployeeAPI.Domains.Enums;

namespace EmployeeAPI.Application.DTOs
{
    public class UpdateEmployeeDto
    {
        [Required(ErrorMessage = "O primeiro nome é obrigatório")]
        public string FirstName { get; set; }
        
        [Required(ErrorMessage = "O último nome é obrigatório")]
        public string LastName { get; set; }
        
        [Required(ErrorMessage = "O email é obrigatório")]
        [EmailAddress(ErrorMessage = "Email inválido")]
        public string Email { get; set; }
        
        [Required(ErrorMessage = "O número do documento é obrigatório")]
        public string DocumentNumber { get; set; }
        
    
        public List<PhoneDto> Phones { get; set; } = [];
        
        public int? ManagerId { get; set; }
        
        [Required(ErrorMessage = "A data de nascimento é obrigatória")]
        public DateTime BirthDate { get; set; }
        
        [Required(ErrorMessage = "O cargo é obrigatório")]
        public Role Role { get; set; }

        public string? Password { get; set; }
    }
}