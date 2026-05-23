import { useState } from 'react';

type InventoryAdjustmentModalProps = {
  item: any | null;
  branchId: string;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: { branchId: string; productId: string; quantity: number; reason: string; type: 'in' | 'out' }) => void;
};

export function InventoryAdjustmentModal({ item, branchId, isSubmitting, onClose, onSubmit }: InventoryAdjustmentModalProps) {
  const [type, setType] = useState<'in' | 'out'>('out');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');

  if (!item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(quantity);
    if (qty > 0 && reason.trim()) {
      onSubmit({
        branchId,
        productId: item.productId,
        quantity: qty,
        reason,
        type
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Ajuste de Inventario</h2>
            <p className="text-sm text-slate-500 font-medium">{item.name}</p>
          </div>
          <button onClick={onClose} disabled={isSubmitting} className="text-slate-400 hover:text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setType('in')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${type === 'in' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Entrada (+)
            </button>
            <button
              type="button"
              onClick={() => setType('out')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${type === 'out' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Merma / Salida (-)
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Cantidad ({item.unit})</label>
            <input
              type="number"
              step="0.01"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              disabled={isSubmitting}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
              required
              min="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Motivo</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isSubmitting}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary resize-none"
              rows={3}
              required
              placeholder={type === 'in' ? 'Ej: Conteo físico mayor' : 'Ej: Merma por mal estado'}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !quantity || !reason.trim()}
              className={`w-full py-3 text-white font-bold rounded-lg transition-colors disabled:opacity-50 ${type === 'in' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
            >
              {isSubmitting ? 'Guardando...' : `Registrar ${type === 'in' ? 'Entrada' : 'Salida'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
