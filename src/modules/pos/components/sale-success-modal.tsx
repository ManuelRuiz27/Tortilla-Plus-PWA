type SaleSuccessModalProps = {
  open: boolean;
  saleNumber: string;
  total: number;
  paymentSummary: string;
  changeAmount?: number;
  onNewSale: () => void;
};

export function SaleSuccessModal({
  open,
  saleNumber,
  total,
  paymentSummary,
  changeAmount = 0,
  onNewSale
}: SaleSuccessModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden text-center animate-in zoom-in-95 duration-300">
        <div className="bg-green-500 p-6 flex justify-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Venta Exitosa</h2>
            <p className="text-slate-500 mt-1">Folio: {saleNumber}</p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Total Cobrado</span>
              <span className="font-bold text-slate-900">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Método</span>
              <span className="font-medium text-slate-700">{paymentSummary}</span>
            </div>
            {changeAmount > 0 && (
              <div className="flex justify-between text-base pt-2 border-t border-slate-200 mt-2">
                <span className="font-bold text-green-700">Cambio a Entregar</span>
                <span className="font-bold text-green-700 text-xl">${changeAmount.toFixed(2)}</span>
              </div>
            )}
          </div>

          <button
            onClick={onNewSale}
            className="w-full py-3 px-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
          >
            Siguiente Venta (Enter)
          </button>
        </div>
      </div>
    </div>
  );
}
