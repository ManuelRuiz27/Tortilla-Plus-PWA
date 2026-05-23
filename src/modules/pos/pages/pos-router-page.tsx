import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiCheckCashSession } from '../../../api/api.service';
import { useBranchStore } from '../../../shared/stores/branch.store';
import { useCashStore } from '../../../shared/stores/cash.store';

export function PosRouterPage() {
  const navigate = useNavigate();
  const { activeBranchId } = useBranchStore();
  const { setCashSession } = useCashStore();

  const { data: session, isLoading, error } = useQuery({
    queryKey: ['cash-session', activeBranchId],
    queryFn: () => apiCheckCashSession(activeBranchId!),
    enabled: !!activeBranchId,
  });

  useEffect(() => {
    if (isLoading) return;

    if (error) {
      // Manejar error (en una app real podríamos mostrar un PosErrorAlert)
      console.error(error);
      return;
    }

    if (session) {
      setCashSession(session);
      navigate('/app/pos/sale', { replace: true });
    } else {
      setCashSession(null);
      navigate('/app/pos/cash/open', { replace: true });
    }
  }, [session, isLoading, error, navigate, setCashSession]);

  return (
    <div className="flex-1 flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4 text-slate-600 font-medium">Verificando estado de la caja...</p>
      </div>
    </div>
  );
}
