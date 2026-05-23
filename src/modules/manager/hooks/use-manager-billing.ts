import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  apiGetInvoices, 
  apiStampIndividualInvoice, 
  apiStampGlobalInvoice, 
  apiCancelInvoice 
} from '../../../api/api.service';

export function useInvoices(branchId: string | null) {
  return useQuery({
    queryKey: ['invoices', branchId],
    queryFn: () => apiGetInvoices(branchId!),
    enabled: !!branchId,
  });
}

export function useStampIndividual() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => apiStampIndividualInvoice(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['invoices', variables.branchId] });
    }
  });
}

export function useStampGlobal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ date }: { branchId: string; date: string }) => apiStampGlobalInvoice(date),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['invoices', variables.branchId] });
    }
  });
}

export function useCancelInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ invoiceId }: { branchId: string; invoiceId: string }) => apiCancelInvoice(invoiceId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['invoices', variables.branchId] });
    }
  });
}
