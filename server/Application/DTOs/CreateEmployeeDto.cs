using System.ComponentModel.DataAnnotations;
using EmployeeAPI.Domains.Enums;

namespace EmployeeAPI.Application.DTOs
{
    public class CreateEmployeeDto
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
        
        [Required(ErrorMessage = "Ao menos um telefone é obrigatório")]
        [MinLength(1, ErrorMessage = "Deve informar pelo menos um telefone")]
        public List<PhoneDto> Phones { get; set; } = [];
        
        public int? ManagerId { get; set; }
        
        [Required(ErrorMessage = "A senha é obrigatória")]
        [MinLength(8, ErrorMessage = "A senha deve ter pelo menos 8 caracteres")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$", 
            ErrorMessage = "A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial")]
        public string Password { get; set; }
        
        [Required(ErrorMessage = "A data de nascimento é obrigatória")]
        public DateTime BirthDate { get; set; }
        
        [Required(ErrorMessage = "O cargo é obrigatório")]
        public Role Role { get; set; }
    }
}