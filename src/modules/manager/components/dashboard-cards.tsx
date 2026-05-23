type DashboardCardsProps = {
  salesData: any;
  isLoading: boolean;
};

export function DashboardCards({ salesData, isLoading }: DashboardCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm animate-pulse h-32"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Ventas */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Ventas del Día</h3>
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
        </div>
        <div>
          <div className="text-3xl font-bold text-slate-900">${salesData?.totalSales?.toFixed(2) || '0.00'}</div>
          <div className="text-sm text-slate-500 mt-1 flex items-center gap-2">
            <span>Efectivo: ${salesData?.salesByMethod?.cash?.toFixed(2) || '0.00'}</span>
            <span className="text-slate-300">|</span>
            <span>Tarjeta: ${salesData?.salesByMethod?.card?.toFixed(2) || '0.00'}</span>
          </div>
        </div>
      </div>

      {/* Tickets */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Tickets Hoy</h3>
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
          </div>
        </div>
        <div>
          <div className="text-3xl font-bold text-slate-900">{salesData?.ticketsCount || 0}</div>
          <p className="text-sm text-slate-500 mt-1">Total de tickets emitidos</p>
        </div>
      </div>

      {/* Ticket Promedio */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Ticket Promedio</h3>
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          </div>
        </div>
        <div>
          <div className="text-3xl font-bold text-slate-900">${salesData?.averageTicket?.toFixed(2) || '0.00'}</div>
          <p className="text-sm text-slate-500 mt-1">Monto promedio por compra</p>
        </div>
      </div>
    </div>
  );
}
