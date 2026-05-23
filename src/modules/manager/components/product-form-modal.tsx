import { useState } from 'react';

type ProductFormModalProps = {
  product?: any;
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (product: any) => void;
};

export function ProductFormModal({ product, isOpen, isSubmitting, onClose, onSubmit }: ProductFormModalProps) {
  const isEditing = !!product;

  const [name, setName] = useState(product?.name || '');
  const [productType, setProductType] = useState(product?.productType || 'retail');
  const [unit, setUnit] = useState(product?.unit || 'piece');
  const [status, setStatus] = useState(product?.status || 'active');

  // Si abren de nuevo el modal, idealmente usar useEffect para resetear valores
  // Para fines prácticos de la demo, usaremos la key en el componente padre.

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: product?.id || `prod-new-${Math.random().toString(36).substr(2, 6)}`,
      name,
      productType,
      unit,
      status,
      isSellable: true
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">
            {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button onClick={onClose} disabled={isSubmitting} className="text-slate-400 hover:text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Comercial</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
              required
              placeholder="Ej: Totopos Naturales 250g"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                disabled={isSubmitting || isEditing} // No dejamos cambiar tipo si ya existe
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary bg-white"
              >
                <option value="retail">Retail (Abarrotes)</option>
                <option value="tortilla">Tortilla</option>
                <option value="masa">Masa</option>
                <option value="package">Paquete Creado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Unidad de Medida</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                disabled={isSubmitting}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary bg-white"
              >
                <option value="piece">Pieza (Pz)</option>
                <option value="kg">Kilogramo (Kg)</option>
                <option value="package">Paquete</option>
              </select>
            </div>
          </div>

          {productType === 'package' && (
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-sm text-amber-800">
              Nota: La configuración de contenido del paquete (ej. 800g de Tortilla) se implementará en una versión futura. Por ahora se venderá como un producto de precio fijo.
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="active" checked={status === 'active'} onChange={() => setStatus('active')} className="text-primary focus:ring-primary" />
                <span className="text-sm">Activo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-500">
                <input type="radio" value="inactive" checked={status === 'inactive'} onChange={() => setStatus('inactive')} className="text-primary focus:ring-primary" />
                <span className="text-sm">Inactivo (No visible)</span>
              </label>
            </div>
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
              {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
