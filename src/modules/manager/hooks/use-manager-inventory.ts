import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGetInventory, apiAdjustInventory, apiProductionEntry } from '../../../api/api.service';

export function useInventory(branchId: string | null) {
  return useQuery({
    queryKey: ['inventory', branchId],
    queryFn: () => apiGetInventory(branchId!),
    enabled: !!branchId,
  });
}

export function useAdjustInventory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { branchId: string; productId: string; quantity: number; reason: string; type: 'in' | 'out' }) => 
      apiAdjustInventory(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inventory', variables.branchId] });
    }
  });
}

export function useProductionEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { branchId: string; productId: string; quantity: number }) => 
      apiProductionEntry(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inventory', variables.branchId] });
    }
  });
}
