import type { PosProductWithPrice, PosCartItem } from '../types/pos.types';

type RetailProductCardProps = {
  product: PosProductWithPrice;
  onAddItem: (item: PosCartItem) => void;
};

export function RetailProductCard({ product, onAddItem }: RetailProductCardProps) {
  const price = product.activePrice || 0;

  const handleClick = () => {
    onAddItem({
      localId: Math.random().toString(36).substring(7),
      productId: product.id,
      productName: product.name,
      productType: product.productType,
      saleMode: 'by_unit',
      quantity: 1, // Siempre agrega de 1 en 1
      unit: product.unit,
      unitPrice: price,
      total: price,
    });
  };

  return (
    <button
      onClick={handleClick}
      className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-primary hover:shadow-md transition-all text-left flex flex-col justify-between h-full"
    >
      <div className="mb-2">
        <h4 className="font-semibold text-slate-800 text-sm line-clamp-2 leading-tight">{product.name}</h4>
      </div>
      <div className="mt-auto flex justify-between items-center">
        <span className="text-xs text-slate-500 capitalize">{product.unit}</span>
        <span className="font-bold text-primary">${price.toFixed(2)}</span>
      </div>
    </button>
  );
}
