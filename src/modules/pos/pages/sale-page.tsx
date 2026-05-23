import { useState } from 'react';
import { useBranchStore } from '../../../shared/stores/branch.store';
import { usePosProducts } from '../hooks/use-pos-products';
import { usePosCartStore } from '../stores/pos-cart.store';
import { useCreateSale, useCompleteSale, useCancelDraftSale } from '../hooks/use-pos-sales';
import type { PosMixedPayment } from '../types/payment.types';

import { WeightSaleInput } from '../components/weight-sale-input';
import { AmountSaleInput } from '../components/amount-sale-input';
import { PackageQuickButton } from '../components/package-quick-button';
import { ProductQuickGrid } from '../components/product-quick-grid';
import { CartPanel } from '../components/cart-panel';
import { PaymentModal } from '../components/payment-modal';
import { SaleSuccessModal } from '../components/sale-success-modal';
import { PosErrorAlert } from '../components/pos-error-alert';
import { KeyboardShortcutsProvider } from '../components/keyboard-shortcuts-provider';

export function SalePage() {
  const { activeBranchId } = useBranchStore();
  const { data: products = [], isLoading } = usePosProducts(activeBranchId);
  const { items, subtotal, total, addItem, removeItem, clearCart } = usePosCartStore();

  const createSaleMutation = useCreateSale();
  const completeSaleMutation = useCompleteSale();
  const cancelDraftSaleMutation = useCancelDraftSale();

  // Estados locales para modales y control de flujo
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  
  const [successData, setSuccessData] = useState<{ saleNumber: string; total: number; method: string; change: number } | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Encontrar productos principales
  const tortillaProduct = products.find(p => p.productType === 'tortilla');
  const masaProduct = products.find(p => p.productType === 'masa');
  const package800Product = products.find(p => p.id === 'prod-pack-800');

  // --- Manejo de la Venta (Draft) ---
  const handleCheckout = async () => {
    if (items.length === 0) return;
    try {
      const payload = {
        branchId: activeBranchId,
        items: items.map(item => ({
          productId: item.productId,
          saleMode: item.saleMode,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total
        })),
        total
      };
      const draft = await createSaleMutation.mutateAsync(payload);
      setActiveDraftId(draft.id);
      
      // Guardar numero de venta temporal en successData por si falla al final
      setSuccessData({ saleNumber: draft.saleNumber, total: draft.total, method: '', change: 0 });
      setPaymentModalOpen(true);
    } catch (err: any) {
      setGlobalError(err.message || "No se pudo iniciar el cobro");
    }
  };

  const handleCancelTicket = async () => {
    if (items.length === 0) return;
    if (confirm('¿Estás seguro de cancelar el ticket actual?')) {
      if (activeDraftId) {
        cancelDraftSaleMutation.mutate(activeDraftId);
        setActiveDraftId(null);
      }
      clearCart();
    }
  };

  // --- Completar pagos ---
  const processPayment = async (payments: any[], methodSummary: string, changeAmount: number = 0) => {
    if (!activeDraftId) return;
    try {
      await completeSaleMutation.mutateAsync({ saleId: activeDraftId, payments });
      
      // Si fue exitoso, actualizar resumen, cerrar modal de pago y abrir modal de éxito
      setSuccessData(prev => prev ? { ...prev, method: methodSummary, change: changeAmount } : null);
      setPaymentModalOpen(false);
      
      // El carrito local NO se limpia todavía. Se limpia al cerrar el modal de éxito.
    } catch (err: any) {
      setGlobalError(err.message || "Ocurrió un error al procesar el pago");
      // No cerramos el modal de pago, para que el usuario pueda corregir (ej. falta referencia)
    }
  };

  const handleSubmitCash = (payment: { amount: number }) => {
    const finalTotal = successData?.total ?? total;
    const change = Math.max(0, payment.amount - finalTotal);
    processPayment([{ paymentMethod: 'cash', amount: finalTotal }], 'Efectivo', change);
  };

  const handleSubmitCard = (payment: { amount: number; reference: string; provider?: string }) => {
    const finalTotal = successData?.total ?? total;
    processPayment([{ paymentMethod: 'card', ...payment, amount: finalTotal }], 'Tarjeta');
  };

  const handleSubmitMixed = (payment: PosMixedPayment) => {
    const payments = [];
    if (payment.cashAmount > 0) payments.push({ paymentMethod: 'cash', amount: payment.cashAmount });
    if (payment.cardAmount > 0) payments.push({ paymentMethod: 'card', amount: payment.cardAmount, reference: payment.cardReference, provider: payment.cardProvider });
    
    processPayment(payments, 'Mixto (Efe/Tar)');
  };

  // --- Cerrar modal de pago abortando el cobro ---
  const handleClosePaymentModal = () => {
    setPaymentModalOpen(false);
    // El draft queda "huérfano" por diseño hasta que se cancele el ticket o se pague después.
  };

  // --- Nueva Venta (reset) ---
  const handleNewSale = () => {
    setSuccessData(null);
    setActiveDraftId(null);
    clearCart();
  };

  return (
    <KeyboardShortcutsProvider 
      enabled={!isPaymentModalOpen && !successData?.method} 
      onCheckout={handleCheckout} 
      onCancelTicket={handleCancelTicket}
    >
      <div className="flex-1 flex overflow-hidden bg-slate-100 p-4 gap-4 h-[calc(100vh-64px)] relative">
        
        {/* Columna Izquierda: Captura y Catálogo */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden min-w-[500px]">
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {tortillaProduct && (
              <>
                <WeightSaleInput product={tortillaProduct} label="Tortilla (Kg)" onAddItem={addItem} />
                <AmountSaleInput product={tortillaProduct} label="Tortilla ($)" onAddItem={addItem} />
              </>
            )}
            
            {masaProduct && (
              <>
                <WeightSaleInput product={masaProduct} label="Masa (Kg)" onAddItem={addItem} />
                <AmountSaleInput product={masaProduct} label="Masa ($)" onAddItem={addItem} />
              </>
            )}
          </div>

          {package800Product && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="col-span-1">
                <PackageQuickButton product={package800Product} onAddItem={addItem} />
              </div>
            </div>
          )}

          <div className="flex-1 overflow-hidden min-h-[300px]">
            <ProductQuickGrid products={products} isLoading={isLoading} onAddItem={addItem} />
          </div>
        </div>

        {/* Columna Derecha: Carrito */}
        <div className="w-[400px] flex-shrink-0">
          <CartPanel 
            items={items}
            subtotal={subtotal}
            total={total}
            canCheckout={items.length > 0 && total > 0}
            onRemoveItem={removeItem}
            onClearCart={clearCart}
            onCancelTicket={handleCancelTicket}
            onCheckout={handleCheckout}
          />
        </div>

        {/* Modales y Alertas */}
        <PaymentModal
          open={isPaymentModalOpen}
          total={total}
          isSubmitting={completeSaleMutation.isPending}
          onClose={handleClosePaymentModal}
          onSubmitCash={handleSubmitCash}
          onSubmitCard={handleSubmitCard}
          onSubmitMixed={handleSubmitMixed}
        />

        <SaleSuccessModal
          open={!!(successData && successData.method)}
          saleNumber={successData?.saleNumber || ''}
          total={successData?.total || 0}
          paymentSummary={successData?.method || ''}
          changeAmount={successData?.change || 0}
          onNewSale={handleNewSale}
        />

        <PosErrorAlert 
          error={globalError} 
          onDismiss={() => setGlobalError(null)} 
        />
        
      </div>
    </KeyboardShortcutsProvider>
  );
}
