import { useState, useEffect } from 'react';

type AuthorizeWithdrawalModalProps = {
  withdrawal: any | null;
  isSubmitting: boolean;
  onClose: () => void;
  onAuthorize: (pin: string) => void;
  onReject: () => void;
};

export function AuthorizeWithdrawalModal({ withdrawal, isSubmitting, onClose, onAuthorize, onReject }: AuthorizeWithdrawalModalProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Reset al abrir
  useEffect(() => {
    if (withdrawal) {
      setPin('');
      setError(null);
    }
  }, [withdrawal]);

  if (!withdrawal) return null;

  const handleAuthorize = () => {
    if (pin.length < 4) {
      setError('El PIN debe tener 4 dígitos');
      return;
    }
    setError(null);
    onAuthorize(pin);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-100 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">Autorizar Retiro</h2>
          <p className="text-sm text-slate-500 mt-1">Ingresa tu PIN de seguridad</p>
        </div>

        <div className="p-5 space-y-4">
          <div className="bg-slate-100 rounded-lg p-3 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Motivo:</span>
              <span className="font-medium text-slate-700">{withdrawal.reason}</span>
            </div>
            <div className="flex justify-between text-base border-t border-slate-200 pt-1 mt-1">
              <span className="text-slate-500">Monto:</span>
              <span className="font-bold text-slate-900">${withdrawal.amount.toFixed(2)}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 text-center">PIN de Gerente</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              disabled={isSubmitting}
              className="w-full text-center tracking-[0.5em] text-3xl font-bold border border-slate-300 rounded-lg py-3 focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="••••"
              maxLength={4}
            />
            {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onReject}
            disabled={isSubmitting}
            className="flex-1 py-2 text-red-600 border border-red-200 bg-white hover:bg-red-50 font-medium rounded-lg transition-colors"
          >
            Rechazar
          </button>
          <button
            onClick={handleAuthorize}
            disabled={isSubmitting || pin.length < 4}
            className="flex-1 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? '...' : 'Autorizar'}
          </button>
        </div>
      </div>
    </div>
  );
}
