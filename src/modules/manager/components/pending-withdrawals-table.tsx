type PendingWithdrawalsTableProps = {
  withdrawals: any[];
  isLoading: boolean;
  onSelectWithdrawal: (withdrawal: any) => void;
};

export function PendingWithdrawalsTable({ withdrawals, isLoading, onSelectWithdrawal }: PendingWithdrawalsTableProps) {
  if (isLoading) {
    return <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm animate-pulse h-64"></div>;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <h2 className="font-bold text-slate-800">Retiros Pendientes de Autorización</h2>
        {withdrawals.length > 0 && (
          <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full">
            {withdrawals.length} solicitudes
          </span>
        )}
      </div>

      {withdrawals.length === 0 ? (
        <div className="p-8 text-center text-slate-500 flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 mb-3"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <p>No hay solicitudes de retiro pendientes.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-slate-50 uppercase">
              <tr>
                <th className="px-4 py-3">Hora</th>
                <th className="px-4 py-3">Cajero</th>
                <th className="px-4 py-3">Motivo</th>
                <th className="px-4 py-3 text-right">Monto</th>
                <th className="px-4 py-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w) => {
                const time = new Date(w.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return (
                  <tr key={w.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-700">{time}</td>
                    <td className="px-4 py-3 text-slate-600">{w.requestedBy}</td>
                    <td className="px-4 py-3 text-slate-600">{w.reason}</td>
                    <td className="px-4 py-3 font-bold text-slate-900 text-right">${w.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => onSelectWithdrawal(w)}
                        className="bg-primary text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-primary/90 transition-colors"
                      >
                        Revisar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
