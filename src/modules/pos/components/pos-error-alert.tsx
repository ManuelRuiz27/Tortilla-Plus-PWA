import { useEffect, useState } from 'react';

const POS_ERROR_MESSAGES: Record<string, string> = {
  NO_OPEN_CASH_SESSION: "No hay caja abierta para vender.",
  CARD_REFERENCE_REQUIRED: "Falta la referencia de la terminal para el pago con tarjeta.",
  PAYMENT_TOTAL_MISMATCH: "El pago capturado no coincide con el total de la venta.",
  PRODUCT_INACTIVE: "Este producto ya no está activo.",
  PRICE_NOT_FOUND: "Este producto no tiene precio configurado en esta sucursal.",
  INSUFFICIENT_STOCK: "Stock insuficiente para realizar la venta.",
  NEGATIVE_STOCK_NOT_ALLOWED: "No se permite stock negativo para este producto.",
  BRANCH_ACCESS_DENIED: "No tienes acceso a esta sucursal.",
};

type PosErrorAlertProps = {
  error: any | string | null;
  onDismiss?: () => void;
};

export function PosErrorAlert({ error, onDismiss }: PosErrorAlertProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (error) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        if (onDismiss) onDismiss();
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [error, onDismiss]);

  if (!error || !visible) return null;

  let errorMessage = "Ocurrió un error inesperado al procesar la operación.";
  
  if (typeof error === 'string') {
    errorMessage = POS_ERROR_MESSAGES[error] || error;
  } else if (error?.message) {
    errorMessage = POS_ERROR_MESSAGES[error.message] || error.message;
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-red-600 text-white px-6 py-3 rounded-full shadow-lg font-medium flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
        {errorMessage}
        {onDismiss && (
          <button onClick={() => { setVisible(false); onDismiss(); }} className="ml-2 hover:text-red-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
          </button>
        )}
      </div>
    </div>
  );
}
