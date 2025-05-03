using EmployeeAPI.Application.DTOs;
using EmployeeAPI.Domains.Entities;
using EmployeeAPI.Domains.Enums;
using EmployeeAPI.Infrastructure.Repositories;

namespace EmployeeAPI.Application.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IPasswordService _passwordService;
        
        public EmployeeService(IEmployeeRepository employeeRepository, IPasswordService passwordService)
        {
            _employeeRepository = employeeRepository;
            _passwordService = passwordService;
        }
        
        public async Task<List<EmployeeDto>> GetAllAsync()
        {
            var employees = await _employeeRepository.GetAllAsync();
            return employees.Select(e => MapToDto(e)).ToList();
        }
        public async Task<List<EmployeeDto>> GetSubordinadosById(int role)
        { 
            var employees = await _employeeRepository
                .GetSubordinadosById(role);
            return employees.Select(e => MapToDto(e)).ToList();
        }
        
        public async Task<EmployeeDto> GetByIdAsync(int id)
        {
            var employee = await _employeeRepository
                .GetByIdAsync(id);
            if (employee == null)
                return null;
                
            return MapToDto(employee);
        }
        
        public async Task<Result<EmployeeDto>> CreateAsync(CreateEmployeeDto dto, int creatorRoleLevel)
        {
            // Validar idade mínima
            if (DateTime.Now.AddYears(-18) < dto.BirthDate)
                return Result<EmployeeDto>.Failure("Funcionário deve ser maior de idade.");
            
            // Validar permissões de criação
            if ((int)dto.Role > creatorRoleLevel)
                return Result<EmployeeDto>.Failure("Você não pode criar um usuário com permissões superiores às suas.");
            
            // Validar documento único
            var existingDocument = await _employeeRepository.GetByDocumentNumberAsync(dto.DocumentNumber);
            if (existingDocument != null)
                return Result<EmployeeDto>.Failure("Número de documento já cadastrado.");
            
            // Validar email único
            var existingEmail = await _employeeRepository.GetByEmailAsync(dto.Email);
            if (existingEmail != null)
                return Result<EmployeeDto>.Failure("Email já cadastrado.");
            
            // Validar gerente
            Employee manager = null;
            if (dto.ManagerId.HasValue)
            {
                manager = await _employeeRepository.GetByIdAsync(dto.ManagerId.Value);
                if (manager == null)
                    return Result<EmployeeDto>.Failure("Gerente não encontrado.");
            }
            
            // Criptografar senha
            var (hash, salt) = _passwordService.HashPassword(dto.Password);
            
            // Mapear para entidade
            var employee = new Employee
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                DocumentNumber = dto.DocumentNumber,
                BirthDate = dto.BirthDate,
                ManagerId = dto.ManagerId,
                PasswordHash = hash,
                PasswordSalt = salt,
                Role = dto.Role,
                CreatedAt = DateTime.Now
            };
            
            // Adicionar telefones
            foreach (var phoneDto in dto.Phones)
            {
                employee.Phones.Add(new Phone
                {
                    Number = phoneDto.Number,
                    Type = phoneDto.Type ?? "Mobile"
                });
            }
            
            // Persistir
            await _employeeRepository.CreateAsync(employee);
            
            return Result<EmployeeDto>.Success(MapToDto(employee));
        }
        
        public async Task<Result<EmployeeDto>> UpdateAsync(int id, UpdateEmployeeDto dto, int updaterRoleLevel, int updaterEmployeeId)
        {
            var employee = await _employeeRepository.GetByIdAsync(id);
            if (employee == null)
                return Result<EmployeeDto>.Failure("Funcionário não encontrado.");
            
            // Validar se é o próprio usuário ou alguém com cargo superior
            if (updaterEmployeeId == id || updaterRoleLevel <= (int)employee.Role)
                return Result<EmployeeDto>.Failure("Você não tem permissão para editar este funcionário.");
            
            // Validar idade mínima
            if (DateTime.Now.AddYears(-18) < dto.BirthDate)
                return Result<EmployeeDto>.Failure("Funcionário deve ser maior de idade.");
            
            // Validar email único
            if (employee.Email != dto.Email)
            {
                var existingEmail = await _employeeRepository.GetByEmailAsync(dto.Email);
                if (existingEmail != null)
                    return Result<EmployeeDto>.Failure("Email já cadastrado.");
            }
            
            // Validar gerente
            if (dto.ManagerId.HasValue && dto.ManagerId.Value != employee.ManagerId)
            {
                // Evitar ciclos hierárquicos
                if (dto.ManagerId.Value == id)
                    return Result<EmployeeDto>.Failure("Um funcionário não pode ser gerente de si mesmo.");
                
                var manager = await _employeeRepository.GetByIdAsync(dto.ManagerId.Value);
                if (manager == null)
                    return Result<EmployeeDto>.Failure("Gerente não encontrado.");
            }
            
            // Atualizar dados
            employee.FirstName = dto.FirstName;
            employee.LastName = dto.LastName;
            employee.Email = dto.Email;
            employee.BirthDate = dto.BirthDate;
            employee.ManagerId = dto.ManagerId;
            employee.UpdatedAt = DateTime.Now;
            employee.Role = dto.Role;
            
            // Atualizar senha se fornecida
            if (!string.IsNullOrEmpty(dto.Password))
            {
                var (hash, salt) = _passwordService.HashPassword(dto.Password);
                employee.PasswordHash = hash;
                employee.PasswordSalt = salt;
            }
            
            // Atualizar telefones
            employee.Phones.Clear();
            foreach (var phoneDto in dto.Phones)
            {
                employee.Phones.Add(new Phone
                {
                    Number = phoneDto.Number,
                    Type = phoneDto.Type ?? "Mobile",
                    EmployeeId = employee.Id
                });
            }
            
            // Persistir
            await _employeeRepository.UpdateAsync(employee);
            
            return Result<EmployeeDto>.Success(MapToDto(employee));
        }
        
        public async Task<Result<bool>> DeleteAsync(int id, int deleterRoleLevel, int deleterEmployeeId)
        {
            var employee = await _employeeRepository.GetByIdAsync(id);
            if (employee == null)
                return Result<bool>.Failure("Funcionário não encontrado.");
            
            // Validar se é o próprio usuário ou alguém com cargo superior
            if (deleterEmployeeId != id && deleterRoleLevel <= (int)employee.Role)
                return Result<bool>.Failure("Você não tem permissão para excluir este funcionário.");
            
            // Verificar se tem subordinados
            if (employee.Subordinates != null && employee.Subordinates.Any())
                return Result<bool>.Failure("Este funcionário possui subordinados e não pode ser excluído.");
            
            // Excluir
            await _employeeRepository.DeleteAsync(employee);
            
            return Result<bool>.Success(true);
        }
        
        public async Task<AuthResultDto> AuthenticateAsync(LoginDto loginDto)
        {
            var employee = await _employeeRepository.GetByEmailAsync(loginDto.Email);
            if (employee == null)
                return new AuthResultDto { Success = false, Message = "Usuário ou senha inválidos." };
            
            var isValidPassword = _passwordService.VerifyPassword(loginDto.Password, employee.PasswordHash, employee.PasswordSalt);
            if (!isValidPassword)
                return new AuthResultDto { Success = false, Message = "Usuário ou senha inválidos." };
            
            // Gerar token JWT
            var token = _passwordService.GenerateJwtToken(employee);
            
            return new AuthResultDto
            {
                Success = true,
                Token = token,
                Employee = MapToDto(employee)
            };
        }

  

        private EmployeeDto MapToDto(Employee employee)
        {
            return new EmployeeDto
            {
                Id = employee.Id,
                FirstName = employee.FirstName,
                LastName = employee.LastName,
                Email = employee.Email,
                DocumentNumber = employee.DocumentNumber,
                Phones = employee.Phones?.Select(p => new PhoneDto
                {
                    Id = p.Id,
                    Number = p.Number,
                    Type = p.Type
                }).ToList() ?? [],
                ManagerId = employee.ManagerId,
                ManagerName = employee.Manager?.FullName,
                BirthDate = employee.BirthDate,
                Role = employee.Role,
                CreatedAt = employee.CreatedAt,
                UpdatedAt = employee.UpdatedAt
            };
        }
    }
    
    public interface IEmployeeService
    {
        Task<List<EmployeeDto>> GetAllAsync();
        Task<EmployeeDto> GetByIdAsync(int id);
        Task<Result<EmployeeDto>> CreateAsync(CreateEmployeeDto dto, int creatorRoleLevel);
        Task<Result<EmployeeDto>> UpdateAsync(int id, UpdateEmployeeDto dto, int updaterRoleLevel, int updaterEmployeeId);
        Task<Result<bool>> DeleteAsync(int id, int deleterRoleLevel, int deleterEmployeeId);
        Task<AuthResultDto> AuthenticateAsync(LoginDto loginDto);
        Task<List<EmployeeDto>> GetSubordinadosById(int role);
    }
    
    public class Result<T>
    {
        public bool Succeeded { get; private set; }
        public T Data { get; private set; }
        public string Error { get; private set; }
        
        public static Result<T> Success(T data)
        {
            return new Result<T> { Succeeded = true, Data = data };
        }
        
        public static Result<T> Failure(string error)
        {
            return new Result<T> { Succeeded = false, Error = error };
        }
    }
}