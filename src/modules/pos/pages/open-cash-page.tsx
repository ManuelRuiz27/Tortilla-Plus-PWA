import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { apiOpenCashSession } from '../../../api/api.service';
import { useBranchStore } from '../../../shared/stores/branch.store';
import { useCashStore } from '../../../shared/stores/cash.store';

const openCashSchema = z.object({
  openingAmountCounted: z.number().min(0, "El monto no puede ser negativo"),
  openingNote: z.string().max(250, "La nota no puede exceder 250 caracteres").optional(),
});

type OpenCashFormValues = z.infer<typeof openCashSchema>;

export function OpenCashPage() {
  const navigate = useNavigate();
  const { activeBranchId, activeBranchName } = useBranchStore();
  const { setCashSession } = useCashStore();
  const [suggestedBalance] = useState(500); // Esto vendría de un endpoint real en el futuro

  const form = useForm<OpenCashFormValues>({
    resolver: zodResolver(openCashSchema),
    defaultValues: {
      openingAmountCounted: 0,
      openingNote: '',
    },
  });

  const countedAmount = form.watch('openingAmountCounted');
  const isDiscrepancy = countedAmount !== suggestedBalance;

  const mutation = useMutation({
    mutationFn: (data: OpenCashFormValues) => 
      apiOpenCashSession(activeBranchId!, data.openingAmountCounted, data.openingNote),
    onSuccess: (session) => {
      setCashSession(session);
      navigate('/app/pos/sale');
    },
    onError: (error) => {
      console.error('Error al abrir caja:', error);
      // Aquí se mostraría un Toast o Alert real
    }
  });

  const onSubmit = (data: OpenCashFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 text-white p-6 text-center">
          <h2 className="text-xl font-bold">Apertura de Caja</h2>
          <p className="text-slate-300 text-sm mt-1">{activeBranchName}</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="bg-slate-50 p-4 rounded-md border border-slate-200 text-center">
            <div className="text-sm text-slate-500 font-medium">Saldo Sugerido (Fondo)</div>
            <div className="text-2xl font-bold text-slate-900">${suggestedBalance.toFixed(2)}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Monto Contado en Físico *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
              <input
                type="number"
                step="0.01"
                {...form.register('openingAmountCounted', { valueAsNumber: true })}
                className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-lg"
                placeholder="0.00"
              />
            </div>
            {form.formState.errors.openingAmountCounted && (
              <p className="mt-1 text-sm text-red-600">{form.formState.errors.openingAmountCounted.message}</p>
            )}
          </div>

          {isDiscrepancy && countedAmount > 0 && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-amber-700 font-medium">
                    Hay una diferencia de ${(countedAmount - suggestedBalance).toFixed(2)}. Se registrará una discrepancia.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nota u Observaciones (Opcional)
            </label>
            <textarea
              {...form.register('openingNote')}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              rows={3}
              placeholder="Ej. Falta moneda fraccionaria..."
            />
            {form.formState.errors.openingNote && (
              <p className="mt-1 text-sm text-red-600">{form.formState.errors.openingNote.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-md font-bold text-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50"
          >
            {mutation.isPending ? 'Abriendo Caja...' : 'Abrir Caja y Comenzar Venta'}
          </button>
        </form>
      </div>
    </div>
  );
}
