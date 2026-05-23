import { useState } from 'react';

type CustomerFormModalProps = {
  customer?: any;
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (customer: any) => void;
};

export function CustomerFormModal({ customer, isOpen, isSubmitting, onClose, onSubmit }: CustomerFormModalProps) {
  const isEditing = !!customer;

  const [name, setName] = useState(customer?.name || '');
  const [phone, setPhone] = useState(customer?.phone || '');
  const [hasCredit, setHasCredit] = useState(customer?.hasCredit || false);
  const [creditLimit, setCreditLimit] = useState(customer?.creditLimit || 0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: customer?.id || `cust-new-${Math.random().toString(36).substr(2, 6)}`,
      name,
      phone,
      hasCredit,
      creditLimit: hasCredit ? parseFloat(creditLimit as string) : 0,
      balance: customer?.balance || 0,
      status: 'active'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">
            {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h2>
          <button onClick={onClose} disabled={isSubmitting} className="text-slate-400 hover:text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Comercial / Razón Social</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
              required
              placeholder="Ej: Abarrotes Doña Mari"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isSubmitting}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Ej: 555-1234"
            />
          </div>

          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer mb-3">
              <input 
                type="checkbox" 
                checked={hasCredit} 
                onChange={(e) => setHasCredit(e.target.checked)} 
                className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
              />
              <span className="text-sm font-bold text-slate-800">Autorizar Crédito Abierto</span>
            </label>

            {hasCredit && (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 animate-in fade-in slide-in-from-top-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Límite de Crédito Autorizado ($)</label>
                <input
                  type="number"
                  step="0.5"
                  value={creditLimit}
                  onChange={(e) => setCreditLimit(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary font-bold text-lg"
                  required
                  min="0"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Si el cliente supera este límite, los repartidores y cajeros no podrán venderle a crédito.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="flex-1 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
