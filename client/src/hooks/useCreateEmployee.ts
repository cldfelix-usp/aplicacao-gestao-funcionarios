
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Employee, Phone } from './useEmployees';
import API_ENDPOINTS from '../config/constants';

interface CreateEmployeeData {
  firstName: string;
  lastName: string;
  email: string;
  documentNumber: string;
  phones: {
    number: string;
    type: string;
  }[];
  password: string;
  birthDate: string;
  role: number;
  managerId?: number | null;
}

export function useCreateEmployee() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const createEmployee = async (employeeData: CreateEmployeeData) => {
    if (!token) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      // Create a copy of the data to avoid modifying the original object
      let dataToSubmit = { ...employeeData };
      
      // If managerId is undefined, null, or "none", remove it from the payload
      if (!dataToSubmit.managerId || dataToSubmit.managerId === null) {
        const { managerId, ...dataWithoutManagerId } = dataToSubmit;
        dataToSubmit = dataWithoutManagerId;
      }
      
      const response = await fetch(API_ENDPOINTS.EMPLOYEES.CREATE, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSubmit)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        const errorMessage = data.errors ? data.errors.join(', ') : 'Falha ao criar funcionário';
        throw new Error(errorMessage);
      }
      
      toast.success('Funcionário criado com sucesso');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar funcionário';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Erro ao criar funcionário:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createEmployee, loading, error };
}
