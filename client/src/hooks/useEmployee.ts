import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Employee, EmployeeUpdate } from './useEmployees';
import API_ENDPOINTS from '../config/constants';
import { json } from 'stream/consumers';

export function useEmployee(employeeId: string | undefined) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [subordinates, setSubordinates] = useState<Employee[]>([]);
  const [loadingSubordinates, setLoadingSubordinates] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();


  const fetchEmployee = async () => {
    if (!token || !employeeId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_ENDPOINTS.EMPLOYEES.UPDATE(employeeId)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Falha ao buscar detalhes do funcionário');
      }
      
      const result = await response.json();
      setEmployee(result.data); // Make sure we use the data property from the response
    } catch (err) {
      setError('Erro ao carregar detalhes do funcionário');
      toast.error('Erro ao carregar detalhes do funcionário');
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async () => {
    if (!token || !employeeId) return false;
    
    try {
      const response = await fetch(`${API_ENDPOINTS.EMPLOYEES.DELETE(employeeId)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Falha ao excluir funcionário');
      }
      
      toast.success('Funcionário excluído com sucesso');
      return true;
    } catch (err) {
      toast.error('Erro ao excluir funcionário');
      return false;
    }
  };

  const updateEmployee = async (updatedEmployee: Partial<EmployeeUpdate>) => {
    if (!token || !employeeId) return false;

    
    try {
      // Create a copy of the data to avoid modifying the original object
      let dto = { ...updatedEmployee };
      
      // If managerId is undefined or null, remove it from the payload
      if (dto.managerId === undefined || dto.managerId === null) {
        const { managerId, ...dataWithoutManagerId } = dto;
        dto = dataWithoutManagerId;
      }


      
      const response = await fetch(`${API_ENDPOINTS.EMPLOYEES.UPDATE(employeeId)}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dto)
      });
      
      if (!response.ok) {
        const errorResponse = await response.json();
        const r = errorResponse.errors;
        toast.error(r[0]);
      }
      
      const result = await response.json();
      setEmployee(result);
      toast.success('Funcionário atualizado com sucesso');
      return true;
    } catch (err) {
      console.error('Erro ao atualizar funcionário:', err);
      return false;
    }
  };

  const fetchSubordinates = async () => {
    if (!token || !employeeId) return;
    
    setLoadingSubordinates(true);
    console.log('Fetching subordinates for employee:', employeeId, employee);
   
    try {
      const response = await fetch(`${API_ENDPOINTS.EMPLOYEES.GETSUBORDINADOS(employee.role)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Falha ao buscar subordinados');
      }
      
      const result = await response.json();
      setSubordinates(result.data || []);
    } catch (err) {
      toast.error('Erro ao carregar subordinados');
      console.error('Erro ao buscar subordinados:', err);
    } finally {
      setLoadingSubordinates(false);
    }
  };

  return { 
    employee, 
    loading, 
    error, 
    fetchEmployee, 
    deleteEmployee, 
    updateEmployee,
    subordinates,
    loadingSubordinates,
    fetchSubordinates
  };
}
