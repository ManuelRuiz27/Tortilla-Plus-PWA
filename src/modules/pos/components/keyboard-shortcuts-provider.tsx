import { useEffect } from 'react';

type KeyboardShortcutsProviderProps = {
  enabled: boolean;
  onCheckout?: () => void;
  onCancelTicket?: () => void;
  onConfirmModal?: () => void; // Enter in modals
  onCloseModal?: () => void; // Esc in modals
  children: React.ReactNode;
};

export function KeyboardShortcutsProvider({
  enabled,
  onCheckout,
  onCancelTicket,
  onConfirmModal,
  onCloseModal,
  children
}: KeyboardShortcutsProviderProps) {
  
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Evitar atajos si el usuario está escribiendo en un input, a menos que sea Enter o Esc
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName);
      
      switch (e.key) {
        case 'F8':
          e.preventDefault();
          if (onCheckout) onCheckout();
          break;
        case 'F9':
          e.preventDefault();
          if (onCancelTicket) onCancelTicket();
          break;
        case 'Escape':
          if (onCloseModal) onCloseModal();
          break;
        case 'Enter':
          // En formularios de cobro o modals de éxito queremos que Enter confirme,
          // pero si está en un input de búsqueda, tal vez no. 
          // Lo dejamos activo si hay onConfirmModal.
          if (onConfirmModal && !isInput) {
            e.preventDefault();
            onConfirmModal();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, onCheckout, onCancelTicket, onConfirmModal, onCloseModal]);

  return <>{children}</>;
}
