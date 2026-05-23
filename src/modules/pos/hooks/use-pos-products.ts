import { useQuery } from '@tanstack/react-query';
import { apiGetProducts } from '../../../api/api.service';
import type { PosProductWithPrice } from '../types/pos.types';

export function usePosProducts(branchId: string | null) {
  return useQuery({
    queryKey: ['pos-products', branchId],
    queryFn: async () => {
      if (!branchId) return [];
      const products = await apiGetProducts(branchId);
      return products as PosProductWithPrice[];
    },
    enabled: !!branchId,
  });
}
