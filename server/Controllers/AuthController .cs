using EmployeeAPI.Application.DTOs;
using EmployeeAPI.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeAPI.Controllers
{
    [ApiController]
    [Route("api/v1/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;
        
        public AuthController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }
        
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthResultDto>> Login(LoginDto loginDto)
        {
            var result = await _employeeService.AuthenticateAsync(loginDto);
            if (!result.Success)
                return Unauthorized(result.Message);
                
            return Ok(result);
        }
    }
}