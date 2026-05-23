import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  apiGetSalesByDay, 
  apiGetCashSummary, 
  apiGetPendingWithdrawals,
  apiAuthorizeWithdrawal,
  apiRejectWithdrawal
} from '../../../api/api.service';

import { apiCheckCashSession } from '../../../api/api.service';

export function useOpenCashSession(branchId: string | null) {
  return useQuery({
    queryKey: ['cash-session', branchId],
    queryFn: () => apiCheckCashSession(branchId!),
    enabled: !!branchId,
  });
}

export function useSalesByDay(branchId: string | null, date: string) {
  return useQuery({
    queryKey: ['sales-by-day', branchId, date],
    queryFn: () => apiGetSalesByDay(branchId!, date),
    enabled: !!branchId,
  });
}

export function useCashSummary(cashSessionId: string | null) {
  return useQuery({
    queryKey: ['cash-summary', cashSessionId],
    queryFn: () => apiGetCashSummary(cashSessionId!),
    enabled: !!cashSessionId,
  });
}

export function usePendingWithdrawals(branchId: string | null) {
  return useQuery({
    queryKey: ['pending-withdrawals', branchId],
    queryFn: () => apiGetPendingWithdrawals(branchId!),
    enabled: !!branchId,
  });
}

export function useAuthorizeWithdrawal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ withdrawalId, pin }: { withdrawalId: string; pin: string }) => 
      apiAuthorizeWithdrawal(withdrawalId, pin),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-withdrawals'] });
    }
  });
}

export function useRejectWithdrawal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (withdrawalId: string) => apiRejectWithdrawal(withdrawalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-withdrawals'] });
    }
  });
}
