import type { PosCartItem } from '../types/pos.types';

type CartItemRowProps = {
  item: PosCartItem;
  onRemove: (localId: string) => void;
};

export function CartItemRow({ item, onRemove }: CartItemRowProps) {
  // Formatear cantidad dependiendo del modo de venta
  const displayQuantity = item.saleMode === 'by_amount' || item.saleMode === 'by_kg'
    ? `${item.quantity.toFixed(3)} ${item.unit}`
    : `${item.quantity} ${item.unit}`;

  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0 group">
      <div className="flex-1 min-w-0 pr-3">
        <h4 className="text-sm font-semibold text-slate-800 truncate">{item.productName}</h4>
        <div className="flex text-xs text-slate-500 mt-0.5">
          <span>{displayQuantity}</span>
          <span className="mx-1.5">•</span>
          <span>${item.unitPrice.toFixed(2)}/{item.unit}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <span className="font-bold text-slate-900">${item.total.toFixed(2)}</span>
        </div>
        <button
          onClick={() => onRemove(item.localId)}
          className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50 opacity-0 group-hover:opacity-100 focus:opacity-100"
          title="Eliminar item"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
        </button>
      </div>
    </div>
  );
}
