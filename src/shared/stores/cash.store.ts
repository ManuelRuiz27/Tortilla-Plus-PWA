import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CashSession = {
  id: string;
  branchId: string;
  openedAt: string;
  status: 'open' | 'closing' | 'closed';
  openingBalance: number;
};

type CashState = {
  activeCashSessionId: string | null;
  status: 'unknown' | 'not_open' | 'open' | 'closing' | 'closed';
  setCashSession: (session: CashSession | null) => void;
  clearCashSession: () => void;
};

export const useCashStore = create<CashState>()(
  persist(
    (set) => ({
      activeCashSessionId: null,
      status: 'unknown',
      
      setCashSession: (session: CashSession | null) => {
        if (!session) {
          set({
            activeCashSessionId: null,
            status: 'not_open',
          });
          return;
        }
        
        set({
          activeCashSessionId: session.id,
          status: session.status,
        });
      },
      
      clearCashSession: () => {
        set({
          activeCashSessionId: null,
          status: 'unknown',
        });
      },
    }),
    {
      name: 'tortillaplus-cash',
    }
  )
);
