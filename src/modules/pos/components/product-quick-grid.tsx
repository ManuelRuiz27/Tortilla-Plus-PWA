import { useState } from 'react';
import type { PosProductWithPrice, PosCartItem } from '../types/pos.types';
import { RetailProductCard } from './retail-product-card';

type ProductQuickGridProps = {
  products: PosProductWithPrice[];
  isLoading: boolean;
  onAddItem: (item: PosCartItem) => void;
};

export function ProductQuickGrid({ products, isLoading, onAddItem }: ProductQuickGridProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(
    (p) => p.productType === 'retail' && p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </span>
          <input
            type="text"
            placeholder="Buscar productos (ej. Refresco, Salsa)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary text-sm"
          />
        </div>
      </div>
      
      <div className="p-4 overflow-y-auto flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-r-transparent"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredProducts.map((product) => (
              <RetailProductCard 
                key={product.id} 
                product={product} 
                onAddItem={onAddItem} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-500">
            <svg className="mx-auto h-12 w-12 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p>No se encontraron productos retail.</p>
          </div>
        )}
      </div>
    </div>
  );
}
