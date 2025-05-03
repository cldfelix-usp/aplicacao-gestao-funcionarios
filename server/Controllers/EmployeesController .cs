using System.Security.Claims;
using EmployeeAPI.Application.DTOs;
using EmployeeAPI.Application.Services;
using EmployeeAPI.Domains.Enums;
using EmployeeAPI.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeAPI.Controllers
{
    [ApiController]
    [Route("api/v1/employees")]
    [Authorize]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public EmployeesController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmployeeDto>>> GetAll()
        {
            var employees = await _employeeService.GetAllAsync();
            return Ok(new ResultBaseDto<List<EmployeeDto>>(employees));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EmployeeDto>> GetById([FromRoute] int id)
        {
            var employee = await _employeeService.GetByIdAsync(id);
            if (employee == null)
                return NotFound(new ResultBaseDto<EmployeeDto>("Funcionário não encontrado."));

            return Ok(new ResultBaseDto<EmployeeDto>(employee));
        }
        
        [HttpGet("subordinados/{ruserRole}")]
        public async Task<ActionResult<IEnumerable<EmployeeDto>>> GetSubordinadosById([FromRoute] string ruserRole)
        {
            var creatorRoleLevel = ruserRole != null && Enum.TryParse<Role>(ruserRole, true, out Role r) 
                ? (int)r 
                : (int)Role.Employee;
            
            var employees = await _employeeService.GetSubordinadosById(creatorRoleLevel);
            return Ok(new ResultBaseDto<List<EmployeeDto>>(employees));
        }
        
        [HttpPost]
        public async Task<ActionResult<EmployeeDto>> Create([FromBody] CreateEmployeeDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new ResultBaseDto<EmployeeDto>(ModelState.GetErrors()));

            try
            {
                // Obter o nível de permissão do usuário logado
                var role = User.FindFirst("http://schemas.microsoft.com/ws/2008/06/identity/claims/role").Value;
                var creatorRoleLevel = role != null && Enum.TryParse<Role>(role, true, out Role r) 
                    ? (int)r 
                    : (int)Role.Employee;
                
                

                var result = await _employeeService.CreateAsync(dto, creatorRoleLevel);
                if (!result.Succeeded)
                    return BadRequest(new ResultBaseDto<EmployeeDto>(result.Error));

                return CreatedAtAction(nameof(GetById), new { id = result.Data.Id }, result.Data);
            }
            catch (Exception e)
            {
                return StatusCode(500, new ResultBaseDto<EmployeeDto>("x#45T: Erro interno do servidor: "));
            }

        }

        [HttpPut("{id}")]
        public async Task<ActionResult<EmployeeDto>> Update([FromRoute] int id, UpdateEmployeeDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new ResultBaseDto<EmployeeDto>(ModelState.GetErrors()));
            try
            {
                // Obter o nível de permissão e ID do usuário logado
                var role = User.FindFirst("http://schemas.microsoft.com/ws/2008/06/identity/claims/role").Value;
                var updaterRoleLevel = role != null && Enum.TryParse<Role>(role, true, out Role r) 
                    ? (int)r 
                    : (int)Role.Employee;
                var updaterEmployeeId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

                var result = await _employeeService.UpdateAsync(id, dto, updaterRoleLevel, updaterEmployeeId);
                if (!result.Succeeded)
                    return BadRequest(new ResultBaseDto<EmployeeDto>(result.Error));

                return Ok(new ResultBaseDto<EmployeeDto>(result.Data));
            }
            catch (Exception e)
            {
                return StatusCode(500, new ResultBaseDto<EmployeeDto>("x#45A: Erro interno do servidor: "));
            }

        }

        [HttpPut("{id}/add-promocao")]
        public async Task<ActionResult<EmployeeDto>> AddPromocaoAsync([FromRoute] int id, [FromBody] UpdateEmployeeDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new ResultBaseDto<EmployeeDto>(ModelState.GetErrors()));

            try
            {
                // Obter o nível de permissão e ID do usuário logado
                var updaterRoleLevel = int.Parse(User.FindFirst("role").Value);
                var updaterEmployeeId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

                var result = await _employeeService.UpdateAsync(id, dto, updaterRoleLevel, updaterEmployeeId);
                if (!result.Succeeded)
                    return BadRequest(new ResultBaseDto<EmployeeDto>(result.Error));

                return Ok(new ResultBaseDto<EmployeeDto>(result.Data));
            }
            catch (Exception e)
            {
                return StatusCode(500, new ResultBaseDto<EmployeeDto>("x#45B: Erro interno do servidor: "));
            }

        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete([FromRoute] int id)
        {
            try
            {
                // Obter o nível de permissão e ID do usuário logado
                // Obter o nível de permissão e ID do usuário logado
                var role = User.FindFirst("http://schemas.microsoft.com/ws/2008/06/identity/claims/role").Value;
                var deleterRoleLevel = role != null && Enum.TryParse<Role>(role, true, out Role r) 
                    ? (int)r 
                    : (int)Role.Employee;
                var deleterEmployeeId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

                var result = await _employeeService.DeleteAsync(id, deleterRoleLevel, deleterEmployeeId);
                if (!result.Succeeded)
                    return BadRequest(new ResultBaseDto<EmployeeDto>(result.Error));

                return NoContent();
            }
            catch (Exception e)
            {
                return StatusCode(500, new ResultBaseDto<EmployeeDto>("x#45C: Erro interno do servidor: "));

            }

        }
    }
}