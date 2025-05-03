
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

type PhoneInputsProps = {
  form: UseFormReturn<any>;
};

const PhoneInputs: React.FC<PhoneInputsProps> = ({ form }) => {
  const addPhone = () => {
    const phones = form.getValues('phones');
    form.setValue('phones', [...phones, { number: '', type: '' }]);
  };

  const removePhone = (index: number) => {
    const phones = form.getValues('phones');
    if (phones.length > 1) {
      form.setValue('phones', phones.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel>Telefones</FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addPhone}
        >
          <Plus className="h-4 w-4 mr-1" />
          Adicionar
        </Button>
      </div>

      {form.watch('phones').map((_, index) => (
        <div key={index} className="flex space-x-3 items-end">
          <div className="flex-grow">
            <FormField
              control={form.control}
              name={`phones.${index}.number`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex-grow">
            <FormField
              control={form.control}
              name={`phones.${index}.type`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Celular, Comercial" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => removePhone(index)}
            className="mb-2"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default PhoneInputs;
