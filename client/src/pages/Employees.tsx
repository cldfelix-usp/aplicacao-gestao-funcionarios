
import React from 'react';
import Header from '@/components/Header';
import EmployeeList from '@/components/EmployeeList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Employees: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Lista de Funcionários</h2>
        
         
          <Button onClick={() => navigate('/employees/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Funcionário
          </Button>
        </div>
        <EmployeeList />
      </main>
      <footer className="bg-gray-100 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Sistema de Gestão de Funcionários
        </div>
      </footer>
    </div>
  );
};

export default Employees;
