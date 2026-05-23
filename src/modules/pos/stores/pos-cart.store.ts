import { create } from 'zustand';
import type { PosCartItem } from '../types/pos.types';

type PosCartState = {
  items: PosCartItem[];
  subtotal: number;
  total: number;
  
  addItem: (item: PosCartItem) => void;
  removeItem: (localId: string) => void;
  clearCart: () => void;
};

const calculateTotals = (items: PosCartItem[]) => {
  const total = items.reduce((sum, item) => sum + item.total, 0);
  // Por ahora subtotal = total, en el futuro podemos manejar descuentos/impuestos
  return { subtotal: total, total };
};

export const usePosCartStore = create<PosCartState>((set) => ({
  items: [],
  subtotal: 0,
  total: 0,
  
  addItem: (item: PosCartItem) => {
    set((state) => {
      const newItems = [...state.items, item];
      const totals = calculateTotals(newItems);
      return { items: newItems, ...totals };
    });
  },
  
  removeItem: (localId: string) => {
    set((state) => {
      const newItems = state.items.filter((item) => item.localId !== localId);
      const totals = calculateTotals(newItems);
      return { items: newItems, ...totals };
    });
  },
  
  clearCart: () => {
    set({ items: [], subtotal: 0, total: 0 });
  },
}));
