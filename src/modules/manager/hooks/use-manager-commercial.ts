import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  apiGetCustomers, 
  apiCreateCustomer, 
  apiUpdateCustomer, 
  apiGetCustomerDetails, 
  apiUpdateSpecialPrice,
  apiGetRoutes,
  apiStartRoute,
  apiSettleRoute
} from '../../../api/api.service';

// --- Clientes ---
export function useCustomers() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: apiGetCustomers,
  });
}

export function useCustomerDetails(id: string | null) {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: () => apiGetCustomerDetails(id!),
    enabled: !!id,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (customer: any) => apiCreateCustomer(customer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    }
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, customer }: { id: string; customer: any }) => apiUpdateCustomer(id, customer),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer', variables.id] });
    }
  });
}

export function useUpdateSpecialPrice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ customerId, productId, price }: { customerId: string; productId: string; price: number }) => 
      apiUpdateSpecialPrice(customerId, productId, price),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customer', variables.customerId] });
    }
  });
}

// --- Rutas ---
export function useRoutes(branchId: string | null) {
  return useQuery({
    queryKey: ['routes', branchId],
    queryFn: () => apiGetRoutes(branchId!),
    enabled: !!branchId,
  });
}

export function useStartRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (routeId: string) => apiStartRoute(routeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
    }
  });
}

export function useSettleRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ routeId, payload }: { routeId: string; payload: any }) => apiSettleRoute(routeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
    }
  });
}
