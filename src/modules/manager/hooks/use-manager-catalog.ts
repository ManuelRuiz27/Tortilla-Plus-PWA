import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiCreateProduct, apiUpdateProduct, apiUpdatePrice } from '../../../api/api.service';
import { usePosProducts } from '../../pos/hooks/use-pos-products';

// Reutilizamos el hook del POS para obtener los productos activos/todos
export function useCatalogProducts(branchId: string | null) {
  // En un caso real, el manager podría ver productos "inactivos" también. 
  // Por ahora reutilizamos la llamada apiGetProducts.
  return usePosProducts(branchId);
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (product: any) => apiCreateProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pos-products'] });
    }
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, product }: { id: string; product: any }) => apiUpdateProduct(id, product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pos-products'] });
    }
  });
}

export function useUpdatePrice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ branchId, productId, price }: { branchId: string; productId: string; price: number }) => 
      apiUpdatePrice(branchId, productId, price),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pos-products', variables.branchId] });
    }
  });
}
