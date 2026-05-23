import { useState } from 'react';

type PriceChangeModalProps = {
  product: any | null;
  branchId: string;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: { branchId: string; productId: string; price: number }) => void;
};

export function PriceChangeModal({ product, branchId, isSubmitting, onClose, onSubmit }: PriceChangeModalProps) {
  const [newPrice, setNewPrice] = useState('');

  if (!product) return null;

  const currentPrice = product.prices?.find((p: any) => p.branchId === branchId)?.price || product.activePrice || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(newPrice);
    if (priceNum >= 0) {
      onSubmit({
        branchId,
        productId: product.id,
        price: priceNum
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Actualizar Precio</h2>
            <p className="text-sm text-slate-500 font-medium truncate max-w-[200px]">{product.name}</p>
          </div>
          <button onClick={onClose} disabled={isSubmitting} className="text-slate-400 hover:text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="bg-slate-50 p-3 rounded-lg flex justify-between items-center border border-slate-200">
            <span className="text-slate-500 text-sm">Precio Actual:</span>
            <span className="font-bold text-slate-800">${currentPrice.toFixed(2)}</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nuevo Precio ($)</label>
            <input
              type="number"
              step="0.5"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              disabled={isSubmitting}
              className="w-full text-2xl font-bold border border-slate-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-primary focus:border-primary text-center"
              required
              min="0"
              placeholder="0.00"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !newPrice}
              className="w-full py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Precio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
