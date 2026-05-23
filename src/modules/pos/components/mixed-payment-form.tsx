import { useState } from 'react';
import type { PosMixedPayment } from '../types/payment.types'; // Create this type or import from existing

type MixedPaymentFormProps = {
  total: number;
  isSubmitting: boolean;
  onSubmit: (payment: PosMixedPayment) => void;
};

export function MixedPaymentForm({ total, isSubmitting, onSubmit }: MixedPaymentFormProps) {
  const [cashAmountStr, setCashAmountStr] = useState('');
  const [cardAmountStr, setCardAmountStr] = useState('');
  const [reference, setReference] = useState('');

  const cashAmount = parseFloat(cashAmountStr || '0');
  const cardAmount = parseFloat(cardAmountStr || '0');
  const sum = cashAmount + cardAmount;

  const isSumValid = sum === total;
  const isCardValid = cardAmount === 0 || (cardAmount > 0 && reference.trim().length > 0);
  const isValid = isSumValid && isCardValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid && !isSubmitting) {
      onSubmit({
        cashAmount,
        cardAmount,
        cardReference: reference.trim(),
        cardProvider: 'terminal',
      });
    }
  };

  // Helper to auto-calculate the remainder
  const calculateRemainderForCash = () => {
    if (cardAmount < total) {
      setCashAmountStr((total - cardAmount).toFixed(2));
    }
  };

  const calculateRemainderForCard = () => {
    if (cashAmount < total) {
      setCardAmountStr((total - cashAmount).toFixed(2));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-slate-50 p-4 rounded-lg flex justify-between items-center border border-slate-200">
        <span className="text-slate-600 font-medium">Total a cobrar:</span>
        <span className="text-3xl font-bold text-slate-900">${total.toFixed(2)}</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Efectivo ($)</label>
          <div className="flex">
            <input
              type="number"
              step="0.5"
              value={cashAmountStr}
              onChange={(e) => setCashAmountStr(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 text-lg border border-slate-300 rounded-l-md focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="0.00"
            />
            <button type="button" onClick={calculateRemainderForCash} className="px-3 bg-slate-200 text-slate-700 font-medium rounded-r-md hover:bg-slate-300" title="Restante a Efectivo">
              Resto
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tarjeta ($)</label>
          <div className="flex">
            <input
              type="number"
              step="0.5"
              value={cardAmountStr}
              onChange={(e) => setCardAmountStr(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 text-lg border border-slate-300 rounded-l-md focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="0.00"
            />
            <button type="button" onClick={calculateRemainderForCard} className="px-3 bg-slate-200 text-slate-700 font-medium rounded-r-md hover:bg-slate-300" title="Restante a Tarjeta">
              Resto
            </button>
          </div>
        </div>
      </div>

      {cardAmount > 0 && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
          <label className="block text-sm font-medium text-slate-700 mb-1">Referencia Tarjeta *</label>
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Ej: 123456"
            required={cardAmount > 0}
          />
        </div>
      )}

      <div className={`p-3 rounded-lg flex justify-between items-center border ${isSumValid ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
        <span className={`font-medium ${isSumValid ? 'text-green-800' : 'text-amber-800'}`}>
          Suma de pagos:
        </span>
        <span className={`text-xl font-bold ${isSumValid ? 'text-green-700' : 'text-amber-700'}`}>
          ${sum.toFixed(2)}
        </span>
      </div>

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
          `Cobrar Mixto`
        )}
      </button>
    </form>
  );
}
