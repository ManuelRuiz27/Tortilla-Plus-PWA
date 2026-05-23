import { useState } from 'react';
import type { PosProductWithPrice, PosCartItem } from '../types/pos.types';

type WeightSaleInputProps = {
  product: PosProductWithPrice;
  label: string;
  onAddItem: (item: PosCartItem) => void;
};

export function WeightSaleInput({ product, label, onAddItem }: WeightSaleInputProps) {
  const [kg, setKg] = useState('');
  const pricePerKg = product.activePrice || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const quantity = parseFloat(kg);
    
    if (isNaN(quantity) || quantity <= 0) return;

    onAddItem({
      localId: Math.random().toString(36).substring(7),
      productId: product.id,
      productName: product.name,
      productType: product.productType,
      saleMode: 'by_kg',
      quantity,
      unit: product.unit,
      unitPrice: pricePerKg,
      total: quantity * pricePerKg,
    });
    
    setKg(''); // Reset form
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="font-bold text-slate-800 mb-2">{label}</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs text-slate-500 mb-1">Cantidad (Kg)</label>
          <div className="relative">
            <input
              type="number"
              step="0.001"
              value={kg}
              onChange={(e) => setKg(e.target.value)}
              className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary text-lg"
              placeholder="0.000"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">kg</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center bg-slate-50 p-2 rounded text-sm">
          <span className="text-slate-500">Precio/kg: <span className="font-medium text-slate-700">${pricePerKg.toFixed(2)}</span></span>
          <span className="text-slate-500">Total: <span className="font-bold text-slate-900">${(parseFloat(kg || '0') * pricePerKg).toFixed(2)}</span></span>
        </div>
        
        <button
          type="submit"
          disabled={!kg || parseFloat(kg) <= 0}
          className="w-full bg-slate-900 text-white py-2 rounded-md font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Agregar
        </button>
      </form>
    </div>
  );
}
