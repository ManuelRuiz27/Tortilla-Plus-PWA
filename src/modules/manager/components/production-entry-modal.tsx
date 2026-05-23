import { useState } from 'react';

type ProductionEntryModalProps = {
  item: any | null;
  branchId: string;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: { branchId: string; productId: string; quantity: number }) => void;
};

export function ProductionEntryModal({ item, branchId, isSubmitting, onClose, onSubmit }: ProductionEntryModalProps) {
  const [quantity, setQuantity] = useState('');

  if (!item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(quantity);
    if (qty > 0) {
      onSubmit({
        branchId,
        productId: item.productId,
        quantity: qty
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Registro de Producción</h2>
            <p className="text-sm text-slate-500 font-medium">{item.name}</p>
          </div>
          <button onClick={onClose} disabled={isSubmitting} className="text-slate-400 hover:text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm mb-4">
            Registra los kilogramos recién producidos de <strong>{item.name}</strong> para sumarlos al inventario actual.
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Cantidad Producida ({item.unit})</label>
            <input
              type="number"
              step="0.5"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              disabled={isSubmitting}
              className="w-full text-2xl font-bold border border-slate-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-primary focus:border-primary text-center"
              required
              min="0.5"
              placeholder="0.00"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !quantity}
              className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : 'Sumar al Inventario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
