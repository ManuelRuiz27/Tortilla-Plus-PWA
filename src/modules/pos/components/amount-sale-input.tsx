import { useState } from 'react';
import type { PosProductWithPrice, PosCartItem } from '../types/pos.types';

type AmountSaleInputProps = {
  product: PosProductWithPrice;
  label: string;
  onAddItem: (item: PosCartItem) => void;
};

export function AmountSaleInput({ product, label, onAddItem }: AmountSaleInputProps) {
  const [amount, setAmount] = useState('');
  const pricePerKg = product.activePrice || 1; // Evitar división por cero

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalAmount = parseFloat(amount);
    
    if (isNaN(totalAmount) || totalAmount <= 0) return;

    const calculatedKg = totalAmount / pricePerKg;

    onAddItem({
      localId: Math.random().toString(36).substring(7),
      productId: product.id,
      productName: product.name,
      productType: product.productType,
      saleMode: 'by_amount',
      quantity: calculatedKg,
      unit: product.unit,
      unitPrice: pricePerKg,
      total: totalAmount, // El total es exacto al capturado
    });
    
    setAmount(''); // Reset form
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="font-bold text-slate-800 mb-2">{label}</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs text-slate-500 mb-1">Monto ($)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
            <input
              type="number"
              step="0.5"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary text-lg"
              placeholder="0.00"
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center bg-slate-50 p-2 rounded text-sm">
          <span className="text-slate-500">Precio/kg: <span className="font-medium text-slate-700">${pricePerKg.toFixed(2)}</span></span>
          <span className="text-slate-500">Aprox: <span className="font-bold text-slate-900">{(parseFloat(amount || '0') / pricePerKg).toFixed(3)} kg</span></span>
        </div>
        
        <button
          type="submit"
          disabled={!amount || parseFloat(amount) <= 0}
          className="w-full bg-slate-900 text-white py-2 rounded-md font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Agregar
        </button>
      </form>
    </div>
  );
}
