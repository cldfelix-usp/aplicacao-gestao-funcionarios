
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import EmployeeForm from '@/components/employee/EmployeeForm';

const CreateEmployee: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/employees')} 
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h2 className="text-2xl font-bold">Adicionar Novo Funcionário</h2>
        </div>
        
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Dados do Funcionário</CardTitle>
            <CardDescription>
              Preencha os dados para cadastrar um novo funcionário
            </CardDescription>
          </CardHeader>
          <EmployeeForm />
        </Card>
      </main>
      <footer className="bg-gray-100 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Sistema de Gestão de Funcionários
        </div>
      </footer>
    </div>
  );
};

export default CreateEmployee;
