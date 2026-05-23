import { useState } from 'react';
import { useBranchStore } from '../../../shared/stores/branch.store';
import { 
  useOpenCashSession,
  useSalesByDay, 
  useCashSummary, 
  usePendingWithdrawals,
  useAuthorizeWithdrawal,
  useRejectWithdrawal
} from '../hooks/use-manager-dashboard';

import { DashboardCards } from '../components/dashboard-cards';
import { CashSessionSummaryCard } from '../components/cash-session-summary-card';
import { PendingWithdrawalsTable } from '../components/pending-withdrawals-table';
import { AuthorizeWithdrawalModal } from '../components/authorize-withdrawal-modal';

export function DashboardPage() {
  const { activeBranchId } = useBranchStore();
  
  const today = new Date().toISOString().split('T')[0];

  const { data: session } = useOpenCashSession(activeBranchId);
  const cashSessionId = session?.id || null;

  const { data: salesData, isLoading: loadingSales } = useSalesByDay(activeBranchId, today);
  const { data: cashSummary, isLoading: loadingCash } = useCashSummary(cashSessionId);
  const { data: pendingWithdrawals = [], isLoading: loadingWithdrawals } = usePendingWithdrawals(activeBranchId);

  const authorizeMutation = useAuthorizeWithdrawal();
  const rejectMutation = useRejectWithdrawal();

  const [selectedWithdrawal, setSelectedWithdrawal] = useState<any | null>(null);

  const handleAuthorize = async (pin: string) => {
    if (!selectedWithdrawal) return;
    try {
      await authorizeMutation.mutateAsync({ withdrawalId: selectedWithdrawal.id, pin });
      setSelectedWithdrawal(null);
      // Opcional: mostrar tostada de éxito
      alert('Retiro autorizado con éxito');
    } catch (err: any) {
      alert(err.message === 'PIN_INVALIDO' ? 'PIN incorrecto' : 'Ocurrió un error al autorizar');
    }
  };

  const handleReject = async () => {
    if (!selectedWithdrawal) return;
    if (confirm('¿Estás seguro de rechazar este retiro?')) {
      try {
        await rejectMutation.mutateAsync(selectedWithdrawal.id);
        setSelectedWithdrawal(null);
        alert('Retiro rechazado');
      } catch (err) {
        alert('Error al rechazar retiro');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Operativo</h1>
        <p className="text-slate-500 text-sm mt-1">Resumen del día para la sucursal activa.</p>
      </div>

      <DashboardCards salesData={salesData} isLoading={loadingSales} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Columna Izquierda (2/3): Retiros Pendientes */}
        <div className="lg:col-span-2 space-y-6">
          <PendingWithdrawalsTable 
            withdrawals={pendingWithdrawals} 
            isLoading={loadingWithdrawals} 
            onSelectWithdrawal={setSelectedWithdrawal}
          />
        </div>

        {/* Columna Derecha (1/3): Resumen de Caja */}
        <div className="lg:col-span-1 space-y-6">
          <CashSessionSummaryCard 
            cashSummary={cashSummary} 
            isLoading={loadingCash} 
          />
        </div>
      </div>

      <AuthorizeWithdrawalModal
        withdrawal={selectedWithdrawal}
        isSubmitting={authorizeMutation.isPending || rejectMutation.isPending}
        onClose={() => setSelectedWithdrawal(null)}
        onAuthorize={handleAuthorize}
        onReject={handleReject}
      />
    </div>
  );
}
