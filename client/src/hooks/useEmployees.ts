
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import API_ENDPOINTS from '../config/constants';

export interface Phone {
  id: number;
  number: string;
  type: string;
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  documentNumber: string;
  phones: Phone[];
  birthDate: string;
  role: string;
  createdAt: string;
  updatedAt?: string;
  managerId?: number;
  managerName?: string;
}

export interface EmployeeUpdate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  documentNumber: string;
  phones: Phone[];
  birthDate: string;
  role: number;
  createdAt: string;
  updatedAt?: string;
  managerId?: number;
  managerName?: string;
}


export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchEmployees = async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.EMPLOYEES.GET_ALL, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Falha ao buscar funcionários');
      }
      
      const result = await response.json();
      setEmployees(result.data || []);
    } catch (err) {
      setError('Erro ao carregar funcionários');
      toast.error('Erro ao carregar lista de funcionários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [token]);

  return { employees, loading, error, refetch: fetchEmployees };
}
