import { useState } from 'react';
import { CashPaymentForm } from './cash-payment-form';
import { CardPaymentForm } from './card-payment-form';
import { MixedPaymentForm } from './mixed-payment-form';
import type { PosMixedPayment } from '../types/payment.types';

type PaymentModalProps = {
  open: boolean;
  total: number;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmitCash: (payment: { amount: number }) => void;
  onSubmitCard: (payment: { amount: number; reference: string; provider?: string }) => void;
  onSubmitMixed: (payment: PosMixedPayment) => void;
};

export function PaymentModal({
  open,
  total,
  isSubmitting,
  onClose,
  onSubmitCash,
  onSubmitCard,
  onSubmitMixed,
}: PaymentModalProps) {
  const [tab, setTab] = useState<'cash' | 'card' | 'mixed'>('cash');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Cobrar Venta</h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setTab('cash')}
            disabled={isSubmitting}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === 'cash' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Efectivo
          </button>
          <button
            onClick={() => setTab('card')}
            disabled={isSubmitting}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === 'card' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Tarjeta
          </button>
          <button
            onClick={() => setTab('mixed')}
            disabled={isSubmitting}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === 'mixed' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Mixto
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {tab === 'cash' && (
            <CashPaymentForm total={total} isSubmitting={isSubmitting} onSubmit={onSubmitCash} />
          )}
          {tab === 'card' && (
            <CardPaymentForm total={total} isSubmitting={isSubmitting} onSubmit={onSubmitCard} />
          )}
          {tab === 'mixed' && (
            <MixedPaymentForm total={total} isSubmitting={isSubmitting} onSubmit={onSubmitMixed} />
          )}
        </div>
      </div>
    </div>
  );
}
