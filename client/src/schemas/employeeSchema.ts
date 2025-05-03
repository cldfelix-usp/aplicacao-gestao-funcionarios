
import { z } from 'zod';

const phoneSchema = z.object({
  number: z.string().min(8, 'Número inválido'),
  type: z.string().min(3, 'Tipo é obrigatório'),
});

export const employeeFormSchema = z.object({
  firstName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  lastName: z.string().min(2, 'Sobrenome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  documentNumber: z.string().min(5, 'Documento inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  birthDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Data inválida',
  }),
  role: z.coerce.number().min(1, 'Selecione um cargo'),
  phones: z.array(phoneSchema).min(1, 'Adicione pelo menos um telefone'),
  managerId: z.coerce.number().nullable().optional(),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

export const roleOptions = [
  { value: 1, label: 'Employee' },
  { value: 2, label: 'Leader' },
  { value: 3, label: 'Director' },
];
