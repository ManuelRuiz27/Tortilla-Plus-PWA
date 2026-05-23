import { CartItemRow } from './cart-item-row';
import type { PosCartItem } from '../types/pos.types';

type CartPanelProps = {
  items: PosCartItem[];
  subtotal: number;
  total: number;
  canCheckout: boolean;
  onRemoveItem: (localId: string) => void;
  onClearCart: () => void;
  onCancelTicket: () => void;
  onCheckout: () => void;
};

export function CartPanel({
  items,
  subtotal,
  total,
  canCheckout,
  onRemoveItem,
  onClearCart,
  onCancelTicket,
  onCheckout
}: CartPanelProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
          Ticket Actual
        </h2>
        <div className="flex items-center gap-3">
          <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">
            {items.length} items
          </span>
          {items.length > 0 && (
            <button 
              onClick={() => {
                if(confirm('¿Vaciar todo el carrito?')) onClearCart();
              }}
              className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-md"
              title="Vaciar carrito"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center space-y-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <p>El carrito está vacío. Agrega productos para comenzar la venta.</p>
          </div>
        ) : (
          <div className="px-2">
            {items.map(item => (
              <CartItemRow key={item.localId} item={item} onRemove={onRemoveItem} />
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 p-4 bg-slate-50 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-500">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-slate-900">
            <span>Total</span>
            <span className="text-primary">${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onCancelTicket}
            disabled={items.length === 0}
            className="col-span-1 py-3 px-4 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors disabled:opacity-50 disabled:bg-transparent"
          >
            Cancelar (F9)
          </button>
          <button
            onClick={onCheckout}
            disabled={!canCheckout}
            className="col-span-1 py-3 px-4 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            Cobrar (F8)
          </button>
        </div>
      </div>
    </div>
  );
}
