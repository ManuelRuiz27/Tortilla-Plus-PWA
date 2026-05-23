import { useState, useEffect } from 'react';

type CardPaymentFormProps = {
  total: number;
  isSubmitting: boolean;
  onSubmit: (payment: { amount: number; reference: string; provider?: string }) => void;
};

export function CardPaymentForm({ total, isSubmitting, onSubmit }: CardPaymentFormProps) {
  const [reference, setReference] = useState('');

  const isValid = reference.trim().length > 0;

  useEffect(() => {
    const input = document.getElementById('card-reference-input');
    if (input) input.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid && !isSubmitting) {
      onSubmit({ amount: total, reference: reference.trim(), provider: 'terminal' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-slate-50 p-4 rounded-lg flex justify-between items-center border border-slate-200">
        <span className="text-slate-600 font-medium">Total a cobrar:</span>
        <span className="text-3xl font-bold text-slate-900">${total.toFixed(2)}</span>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Referencia / Folio de Tarjeta *</label>
        <input
          id="card-reference-input"
          type="text"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          disabled={isSubmitting}
          className="w-full px-4 py-3 text-xl border border-slate-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary text-slate-900 bg-white"
          placeholder="Ej: 123456"
          required
        />
        <p className="mt-2 text-sm text-slate-500">
          Pasa la tarjeta por la terminal y anota el número de autorización o folio impreso en el voucher.
        </p>
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
          `Registrar Pago con Tarjeta`
        )}
      </button>
    </form>
  );
}
