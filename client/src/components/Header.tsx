
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const { logout } = useAuth();

  return (
    <header className="bg-primary text-primary-foreground py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Sistema de Gestão de Funcionários</h1>
        <Button 
          variant="outline" 
          onClick={logout}
          className="bg-transparent hover:bg-primary-foreground hover:text-primary"
        >
          Sair
        </Button>
      </div>
    </header>
  );
};

export default Header;
