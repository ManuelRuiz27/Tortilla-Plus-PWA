import { useState } from 'react';

type GlobalInvoiceModalProps = {
  branchId: string;
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: { branchId: string; date: string }) => void;
};

export function GlobalInvoiceModal({ branchId, isOpen, isSubmitting, onClose, onSubmit }: GlobalInvoiceModalProps) {
  // Simulamos que el usuario puede elegir facturar las ventas del día actual o anterior
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date) {
      onSubmit({
        branchId,
        date
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">Factura Global Diaria</h2>
          <button onClick={onClose} disabled={isSubmitting} className="text-slate-400 hover:text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="text-sm text-slate-600 mb-4">
            Este proceso compila todos los tickets de mostrador no facturados individualmente durante el día y genera un solo CFDI a Público en General.
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Fecha a Facturar</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isSubmitting}
              max={today}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
          </div>

          {/* Simulamos que la UI calcula cuánto fue para dar confianza */}
          <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg text-center mt-2">
            <p className="text-xs text-blue-700 font-semibold">Total Calculado a Facturar</p>
            <p className="text-2xl font-bold text-blue-900">$8,450.50</p>
            <p className="text-[10px] text-blue-600 mt-1">142 tickets incluidos</p>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !date}
              className="flex-1 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Timbrando...' : 'Emitir Global'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
