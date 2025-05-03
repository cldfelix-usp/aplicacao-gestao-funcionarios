
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEmployee } from '@/hooks/useEmployee';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Pencil, Trash2, Users } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { roleOptions } from '@/schemas/employeeSchema';

const employeeFormSchema = z.object({
  firstName: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  lastName: z.string().min(2, { message: 'O sobrenome deve ter pelo menos 2 caracteres.' }),
  email: z.string().email({ message: 'Email inválido.' }),
  documentNumber: z.string().min(1, { message: 'Documento é obrigatório.' }),
  birthDate: z.string().min(1, { message: 'Data de nascimento é obrigatória.' }),
  role: z.number().min(1, { message: 'Selecione um cargo.' }),
});

type EmployeeFormData = z.infer<typeof employeeFormSchema>;

const EmployeeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    employee, 
    loading, 
    error, 
    fetchEmployee, 
    deleteEmployee, 
    updateEmployee,
    subordinates,
    loadingSubordinates,
    fetchSubordinates 
  } = useEmployee(id);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showSubordinates, setShowSubordinates] = useState(false);
  
  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      documentNumber: '',
      birthDate: '',
      role: 1,
    },
  });

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  useEffect(() => {
    if (employee) {
      form.reset({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        documentNumber: employee.documentNumber,
        birthDate: employee.birthDate ? new Date(employee.birthDate).toISOString().split('T')[0] : '',
        role: parseInt(employee.role),
      });
    }
  }, [employee, form]);

  const handleGoBack = () => {
    navigate('/employees');
  };

  const handleDeleteConfirmed = async () => {
    const success = await deleteEmployee();
    if (success) {
      navigate('/employees');
    }
  };

  const handleEditSubmit = async (data: EmployeeFormData) => {
    const success = await updateEmployee(data);
    if (success) {
      setIsEditDialogOpen(false);
      fetchEmployee();
    }
  };

  const handleToggleSubordinates = async () => {
    if (!showSubordinates) {
      await fetchSubordinates();
    }
    setShowSubordinates(!showSubordinates);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (error) {
      return 'Data inválida';
    }
  };

  const getRoleBadgeColor = (role: string | undefined) => {
    if (!role) return 'bg-gray-500 hover:bg-gray-600';
    
    switch (role.toLowerCase()) {
      case 'director':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'manager':
        return 'bg-green-500 hover:bg-green-600';
      case 'employee':
        return 'bg-yellow-500 hover:bg-yellow-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Button onClick={handleGoBack} variant="outline" className="mb-4">Voltar</Button>
          <Card className="w-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-24" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-5 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Button onClick={handleGoBack} variant="outline" className="mb-4">Voltar</Button>
          <Card className="w-full bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-500 text-center">
                {error || 'Funcionário não encontrado'}
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <Button onClick={handleGoBack} variant="outline">Voltar</Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                  <AlertDialogDescription>
                    Você tem certeza que deseja excluir este funcionário? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteConfirmed}>Excluir</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <Card className="w-full mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">{employee?.firstName} {employee?.lastName}</CardTitle>
              <Badge className={getRoleBadgeColor(employee?.role)}>{employee?.role}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Informações Pessoais</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Email:</span> {employee?.email}</p>
                    <p><span className="font-medium">Documento:</span> {employee?.documentNumber}</p>
                    <p><span className="font-medium">Data de Nascimento:</span> {employee?.birthDate && formatDate(employee.birthDate)}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Contato</h3>
                  {employee?.phones && employee.phones.length > 0 ? (
                    <div>
                      <span className="font-medium">Telefones:</span>
                      <ul className="list-disc pl-5 mt-1">
                        {employee.phones.map(phone => (
                          <li key={phone.id}>
                            {phone.number} ({phone.type})
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p>Nenhum telefone cadastrado</p>
                  )}
                </div>
              </div>
              {employee?.managerName && (
                <p><span className="font-medium">Gerente:</span> {employee.managerName}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Cadastrado em: {employee?.createdAt && formatDate(employee.createdAt)}
              </p>
              {employee?.updatedAt && (
                <p className="text-sm text-muted-foreground">
                  Última atualização: {formatDate(employee.updatedAt)}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              onClick={handleToggleSubordinates}
              className="flex items-center"
            >
              <Users className="mr-2 h-4 w-4" />
              {showSubordinates ? 'Ocultar Subordinados' : 'Mostrar Subordinados'}
            </Button>
          </CardFooter>
        </Card>

        {showSubordinates && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-xl">Subordinados</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingSubordinates ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : subordinates.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subordinates.map((subordinate) => (
                      <TableRow key={subordinate.id}>
                        <TableCell>{subordinate.firstName} {subordinate.lastName}</TableCell>
                        <TableCell>{subordinate.email}</TableCell>
                        <TableCell>
                          <Badge className={getRoleBadgeColor(subordinate.role)}>
                            {subordinate.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="link" 
                            onClick={() => navigate(`/employees/${subordinate.id}`)}
                          >
                            Ver Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p>Este funcionário não possui subordinados.</p>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Funcionário</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sobrenome</FormLabel>
                      <FormControl>
                        <Input placeholder="Sobrenome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="documentNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Documento</FormLabel>
                    <FormControl>
                      <Input placeholder="CPF ou outro documento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Nascimento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

                <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))} 
                      defaultValue={field.value.toString()}
                      
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cargo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roleOptions.map((role) => (
                          <SelectItem key={role.value} value={role.value.toString()} >
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeDetail;
