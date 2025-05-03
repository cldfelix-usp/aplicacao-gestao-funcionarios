using System.Text.Json.Serialization;
using EmployeeAPI.Domains.Enums;

namespace EmployeeAPI.Application.DTOs
{
    public class EmployeeDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string DocumentNumber { get; set; }
        public List<PhoneDto> Phones { get; set; } = [];
        public int? ManagerId { get; set; }
        public string ManagerName { get; set; }
        public DateTime BirthDate { get; set; }
        
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public Role Role { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}