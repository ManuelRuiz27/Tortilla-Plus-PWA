import type { PosProductWithPrice, PosCartItem } from '../types/pos.types';

type PackageQuickButtonProps = {
  product: PosProductWithPrice;
  onAddItem: (item: PosCartItem) => void;
};

export function PackageQuickButton({ product, onAddItem }: PackageQuickButtonProps) {
  const price = product.activePrice || 0;

  const handleClick = () => {
    onAddItem({
      localId: Math.random().toString(36).substring(7),
      productId: product.id,
      productName: product.name,
      productType: product.productType,
      saleMode: 'by_package',
      quantity: 1, // Siempre agrega de 1 en 1 por ahora
      unit: product.unit,
      unitPrice: price,
      total: price,
    });
  };

  return (
    <button
      onClick={handleClick}
      className="w-full bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-primary hover:shadow-md transition-all text-left flex flex-col justify-between h-full"
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-slate-800 line-clamp-2">{product.name}</h3>
          <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded">PQT</span>
        </div>
        <p className="text-xs text-slate-500">Toque para agregar 1 paquete</p>
      </div>
      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-end">
        <span className="text-slate-500 text-sm">Precio</span>
        <span className="text-xl font-bold text-slate-900">${price.toFixed(2)}</span>
      </div>
    </button>
  );
}
