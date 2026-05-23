import { useState, useEffect } from 'react';

type CashPaymentFormProps = {
  total: number;
  isSubmitting: boolean;
  onSubmit: (payment: { amount: number }) => void;
};

export function CashPaymentForm({ total, isSubmitting, onSubmit }: CashPaymentFormProps) {
  const [received, setReceived] = useState('');

  const receivedAmount = parseFloat(received || '0');
  const change = Math.max(0, receivedAmount - total);
  const isValid = receivedAmount >= total;

  // Enfocar el input al montar
  useEffect(() => {
    const input = document.getElementById('cash-received-input');
    if (input) input.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid && !isSubmitting) {
      onSubmit({ amount: total });
    }
  };

  const setQuickAmount = (amount: number) => {
    setReceived(amount.toString());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-slate-50 p-4 rounded-lg flex justify-between items-center border border-slate-200">
        <span className="text-slate-600 font-medium">Total a cobrar:</span>
        <span className="text-3xl font-bold text-slate-900">${total.toFixed(2)}</span>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Efectivo Recibido</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-2xl font-medium">$</span>
          <input
            id="cash-received-input"
            type="number"
            step="0.5"
            value={received}
            onChange={(e) => setReceived(e.target.value)}
            disabled={isSubmitting}
            className="w-full pl-10 pr-4 py-3 text-2xl font-bold border border-slate-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary text-slate-900 bg-white"
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button type="button" onClick={() => setQuickAmount(total)} className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium text-sm transition-colors">Exacto</button>
        <button type="button" onClick={() => setQuickAmount(50)} className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium text-sm transition-colors">$50</button>
        <button type="button" onClick={() => setQuickAmount(100)} className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium text-sm transition-colors">$100</button>
        <button type="button" onClick={() => setQuickAmount(200)} className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium text-sm transition-colors">$200</button>
        <button type="button" onClick={() => setQuickAmount(500)} className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium text-sm transition-colors">$500</button>
        <button type="button" onClick={() => setQuickAmount(1000)} className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium text-sm transition-colors">$1000</button>
      </div>

      {receivedAmount > 0 && (
        <div className={`p-4 rounded-lg flex justify-between items-center border ${isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <span className={`font-medium ${isValid ? 'text-green-800' : 'text-red-800'}`}>
            {isValid ? 'Cambio a entregar:' : 'Falta efectivo:'}
          </span>
          <span className={`text-2xl font-bold ${isValid ? 'text-green-700' : 'text-red-700'}`}>
            ${isValid ? change.toFixed(2) : (total - receivedAmount).toFixed(2)}
          </span>
        </div>
      )}

      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="w-full py-4 px-4 bg-primary text-primary-foreground text-xl font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-r-transparent"></span>
            Procesando...
          </>
        ) : (
          `Cobrar e Imprimir (Enter)`
        )}
      </button>
    </form>
  );
}
