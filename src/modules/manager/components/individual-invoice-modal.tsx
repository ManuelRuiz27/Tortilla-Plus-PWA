import { useState } from 'react';
import { useCustomers } from '../hooks/use-manager-commercial';

type IndividualInvoiceModalProps = {
  branchId: string;
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: any) => void;
};

export function IndividualInvoiceModal({ branchId, isOpen, isSubmitting, onClose, onSubmit }: IndividualInvoiceModalProps) {
  const { data: customers = [] } = useCustomers();
  
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [ticketFolio, setTicketFolio] = useState('');
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCustomerId && ticketFolio && amount) {
      onSubmit({
        branchId,
        customerId: selectedCustomerId,
        ticketFolio,
        amount: parseFloat(amount)
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">Timbrar Factura Individual</h2>
          <button onClick={onClose} disabled={isSubmitting} className="text-slate-400 hover:text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Cliente a Facturar</label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              disabled={isSubmitting}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary bg-white"
              required
            >
              <option value="">Selecciona un cliente...</option>
              {customers.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Folio de Ticket</label>
            <input
              type="text"
              value={ticketFolio}
              onChange={(e) => setTicketFolio(e.target.value.toUpperCase())}
              disabled={isSubmitting}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
              required
              placeholder="Ej: TKT-1045"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Monto Total del Ticket ($)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isSubmitting}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
              required
              min="0.01"
              placeholder="0.00"
            />
          </div>

          <div className="bg-amber-50 text-amber-800 text-xs p-3 rounded-lg border border-amber-200">
            <span className="font-bold">Aviso del SAT:</span> Asegúrate de que el cliente tiene configurados correctamente su RFC y Régimen Fiscal antes de timbrar.
          </div>

          <div className="pt-2 flex gap-3">
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
              disabled={isSubmitting || !selectedCustomerId || !ticketFolio || !amount}
              className="flex-1 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Timbrando CFDI...' : 'Timbrar Factura'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
