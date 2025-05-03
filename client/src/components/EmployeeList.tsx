import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEmployees, Employee } from "@/hooks/useEmployees";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmployeeCard: React.FC<{ employee: Employee }> = ({ employee }) => {
  const navigate = useNavigate();



  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "director":
        return "bg-blue-500 hover:bg-blue-600";
      case "manager":
        return "bg-green-500 hover:bg-green-600";
      case "employee":
        return "bg-yellow-500 hover:bg-yellow-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const handleViewDetails = () => {
    navigate(`/employees/${employee.id}`);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">
            {employee.firstName} {employee.lastName}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge className={getRoleBadgeColor(employee.role)}>
              {employee.role}
            </Badge>
            <Button variant="outline" size="sm" onClick={handleViewDetails}>
              <Eye className="h-4 w-4 mr-1" />
              Detalhes
            </Button>
          </div>
        </div>
      </CardHeader>
      {/* <CardContent>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Email:</span> {employee.email}
          </p>
          <p>
            <span className="font-medium">Documento:</span>{" "}
            {employee.documentNumber}
          </p>
          <p>
            <span className="font-medium">Data de Nascimento:</span>{" "}
            {formatDate(employee.birthDate)}
          </p>

          {employee.phones && employee.phones.length > 0 && (
            <div>
              <span className="font-medium">Telefones:</span>
              <ul className="list-disc pl-5 mt-1">
                {employee.phones.map((phone) => (
                  <li key={phone.id}>
                    {phone.number} ({phone.type})
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            Cadastrado em: {formatDate(employee.createdAt)}
          </p>
        </div>
      </CardContent> */}
    </Card>
  );
};

const EmployeeList: React.FC = () => {
  const { employees, loading, error } = useEmployees();

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="w-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-5 w-20" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full bg-red-50">
        <CardContent className="pt-6">
          <p className="text-red-500 text-center">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (employees.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Nenhum funcionário encontrado
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Total de Funcionários: {employees.length}
      </p>
      {employees.map((employee) => (
        <EmployeeCard key={employee.id} employee={employee} />
      ))}
    </div>
  );
};

export default EmployeeList;
