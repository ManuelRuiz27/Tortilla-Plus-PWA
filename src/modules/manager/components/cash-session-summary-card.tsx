type CashSessionSummaryCardProps = {
  cashSummary: any;
  isLoading: boolean;
};

export function CashSessionSummaryCard({ cashSummary, isLoading }: CashSessionSummaryCardProps) {
  if (isLoading) {
    return <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm animate-pulse h-48"></div>;
  }

  if (!cashSummary) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-center">
        <p className="text-slate-500">No hay información de caja disponible.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-800">Estado de Caja Actual</h2>
        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
          Abierta
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500">Fondo de apertura</span>
          <span className="font-medium text-slate-700">${cashSummary.openingBalance.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500">Ventas en efectivo</span>
          <span className="font-medium text-slate-700">+ ${cashSummary.totalIncomes.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500">Retiros de caja</span>
          <span className="font-medium text-red-600">- ${cashSummary.totalWithdrawals.toFixed(2)}</span>
        </div>
        
        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
          <span className="font-bold text-slate-800">Saldo Esperado en Caja</span>
          <span className="text-2xl font-bold text-primary">${cashSummary.expectedBalance.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
