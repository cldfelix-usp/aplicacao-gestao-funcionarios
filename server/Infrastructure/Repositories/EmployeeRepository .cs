using EmployeeAPI.Domains.Entities;
using EmployeeAPI.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EmployeeAPI.Infrastructure.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly ApplicationDbContext _context;
        
        public EmployeeRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        
        public async Task<List<Employee>> GetAllAsync()
        {
            return await _context.Employees
                .Include(e => e.Phones)
                .Include(e => e.Manager)
                .ToListAsync();
        }
        public async Task<List<Employee>>  GetSubordinadosById(int role)
        {
            return await _context.Employees
                .Where(x=> (int)x.Role < role)
                .Include(e => e.Phones)
                .Include(e => e.Subordinates)
                .ToListAsync();
            //.FirstOrDefaultAsync(e => e.Id == id);
        }
        public async Task<Employee> GetByIdAsync(int id)
        {
            return await _context.Employees
                .Include(e => e.Phones)
                .Include(e => e.Manager)
                .FirstOrDefaultAsync(e => e.Id == id);
        }
        
        public async Task<Employee> GetByEmailAsync(string email)
        {
            return await _context.Employees
                .Include(e => e.Phones)
                .FirstOrDefaultAsync(e => e.Email == email);
        }
        
        public async Task<Employee> GetByDocumentNumberAsync(string documentNumber)
        {
            return await _context.Employees
                .FirstOrDefaultAsync(e => e.DocumentNumber == documentNumber);
        }
        
        public async Task<Employee> CreateAsync(Employee employee)
        {
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();
            return employee;
        }
        
        public async Task UpdateAsync(Employee employee)
        {
            employee.UpdatedAt = DateTime.Now;
            _context.Employees.Update(employee);
            await _context.SaveChangesAsync();
        }
        
        public async Task DeleteAsync(Employee employee)
        {
            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();
        }


    }
    
    public interface IEmployeeRepository
    {
        Task<List<Employee>> GetAllAsync();
        Task<Employee> GetByIdAsync(int id);
        Task<Employee> GetByEmailAsync(string email);
        Task<Employee> GetByDocumentNumberAsync(string documentNumber);
        Task<Employee> CreateAsync(Employee employee);
        Task UpdateAsync(Employee employee);
        Task DeleteAsync(Employee employee);
        Task<List<Employee>> GetSubordinadosById(int id);
    }
}