using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using EmployeeAPI.Domains.Entities;
using Microsoft.IdentityModel.Tokens;

namespace EmployeeAPI.Application.Services
{
    public class PasswordService : IPasswordService
    {
        private readonly string _jwtSecret;
        private readonly string _jwtIssuer;
        private readonly string _jwtAudience;
        
        public PasswordService(string jwtSecret, string jwtIssuer, string jwtAudience)
        {
            _jwtSecret = jwtSecret;
            _jwtIssuer = jwtIssuer;
            _jwtAudience = jwtAudience;
        }
        
        public (string Hash, string Salt) HashPassword(string password)
        {
            // Gerar um salt aleatório
            byte[] saltBytes = new byte[16];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(saltBytes);
            }
            
            // Converter o salt para string para armazenamento
            string salt = Convert.ToBase64String(saltBytes);
            
            // Combinar senha e salt e aplicar PBKDF2
            using (var pbkdf2 = new Rfc2898DeriveBytes(password, saltBytes, 10000, HashAlgorithmName.SHA256))
            {
                byte[] hashBytes = pbkdf2.GetBytes(32);
                string hash = Convert.ToBase64String(hashBytes);
                
                return (hash, salt);
            }
        }
        
        public bool VerifyPassword(string password, string storedHash, string storedSalt)
        {
            // Converter o salt armazenado de volta para bytes
            byte[] saltBytes = Convert.FromBase64String(storedSalt);
            
            // Gerar o hash da senha fornecida usando o mesmo salt
            using (var pbkdf2 = new Rfc2898DeriveBytes(password, saltBytes, 10000, HashAlgorithmName.SHA256))
            {
                byte[] hashBytes = pbkdf2.GetBytes(32);
                string hash = Convert.ToBase64String(hashBytes);
                
                // Comparar os hashes
                return hash == storedHash;
            }
        }
        
        public string GenerateJwtToken(Employee employee)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSecret));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, employee.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, employee.Email),
                new Claim("role", employee.Role.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };
            
            var token = new JwtSecurityToken(
                issuer: _jwtIssuer,
                audience: _jwtAudience,
                claims: claims,
                expires: DateTime.Now.AddHours(3),
                signingCredentials: credentials
            );
            
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
    
    public interface IPasswordService
    {
        (string Hash, string Salt) HashPassword(string password);
        bool VerifyPassword(string password, string storedHash, string storedSalt);
        string GenerateJwtToken(Employee employee);
    }
}