import { useState } from 'react';

type RouteSettlementModalProps = {
  route: any | null;
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: { cashCollected: number; returnedWaste: number }) => void;
};

export function RouteSettlementModal({ route, isOpen, isSubmitting, onClose, onSubmit }: RouteSettlementModalProps) {
  const [cash, setCash] = useState('');
  const [waste, setWaste] = useState('');

  if (!isOpen || !route) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cashVal = parseFloat(cash);
    const wasteVal = parseFloat(waste);
    
    if (cashVal >= 0 && wasteVal >= 0) {
      onSubmit({
        cashCollected: cashVal,
        returnedWaste: wasteVal
      });
    }
  };

  const expectedCash = route.expectedCash || 0;
  const cashDiff = parseFloat(cash || '0') - expectedCash;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Liquidación de Ruta</h2>
            <p className="text-sm text-slate-500 font-medium">{route.name} - {route.driverName}</p>
          </div>
          <button onClick={onClose} disabled={isSubmitting} className="text-slate-400 hover:text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-center">
            <p className="text-sm text-blue-800 font-medium mb-1">Efectivo Esperado según Entregas</p>
            <p className="text-3xl font-bold text-blue-900">${expectedCash.toFixed(2)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Efectivo Entregado Físicamente ($)</label>
            <input
              type="number"
              step="0.5"
              value={cash}
              onChange={(e) => setCash(e.target.value)}
              disabled={isSubmitting}
              className={`w-full text-2xl font-bold border rounded-lg px-3 py-3 focus:outline-none focus:ring-primary text-center transition-colors ${
                cash 
                  ? (cashDiff < 0 ? 'border-red-300 bg-red-50 text-red-700' : 'border-green-300 bg-green-50 text-green-700')
                  : 'border-slate-300'
              }`}
              required
              min="0"
              placeholder="0.00"
            />
            {cash && (
              <p className={`text-xs text-center mt-2 font-bold ${cashDiff < 0 ? 'text-red-600' : 'text-green-600'}`}>
                {cashDiff < 0 ? `Faltante: $${Math.abs(cashDiff).toFixed(2)}` : cashDiff > 0 ? `Sobrante: $${cashDiff.toFixed(2)}` : 'Cuadre Perfecto'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Merma Devuelta (Kg)</label>
            <input
              type="number"
              step="0.5"
              value={waste}
              onChange={(e) => setWaste(e.target.value)}
              disabled={isSubmitting}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
              required
              min="0"
              placeholder="Ej: 2.5"
            />
            <p className="text-xs text-slate-500 mt-1">Este producto se reingresará al inventario como merma.</p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !cash || !waste}
              className="flex-1 py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Procesando...' : 'Cerrar Ruta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
