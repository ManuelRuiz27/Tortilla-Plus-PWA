import { useMutation } from '@tanstack/react-query';
import { apiCreateSale, apiCompleteSale, apiCancelDraftSale } from '../../../api/api.service';

export function useCreateSale() {
  return useMutation({
    mutationFn: (payload: any) => apiCreateSale(payload),
  });
}

export function useCompleteSale() {
  return useMutation({
    mutationFn: ({ saleId, payments }: { saleId: string; payments: any[] }) => 
      apiCompleteSale(saleId, payments),
  });
}

export function useCancelDraftSale() {
  return useMutation({
    mutationFn: (saleId: string) => apiCancelDraftSale(saleId),
  });
}
