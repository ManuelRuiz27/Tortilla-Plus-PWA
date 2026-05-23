import { useState } from 'react';
import { useBranchStore } from '../../../shared/stores/branch.store';
import { useInvoices, useStampIndividual, useStampGlobal, useCancelInvoice } from '../hooks/use-manager-billing';
import { IndividualInvoiceModal } from '../components/individual-invoice-modal';
import { GlobalInvoiceModal } from '../components/global-invoice-modal';

export function BillingPage() {
  const { activeBranchId } = useBranchStore();
  const { data: invoices = [], isLoading } = useInvoices(activeBranchId);
  
  const stampIndividualMutation = useStampIndividual();
  const stampGlobalMutation = useStampGlobal();
  const cancelMutation = useCancelInvoice();

  const [isIndividualModalOpen, setIsIndividualModalOpen] = useState(false);
  const [isGlobalModalOpen, setIsGlobalModalOpen] = useState(false);

  const handleIndividualSubmit = async (payload: any) => {
    try {
      await stampIndividualMutation.mutateAsync(payload);
      setIsIndividualModalOpen(false);
      alert('Factura Individual timbrada con éxito (Simulado)');
    } catch (err) {
      alert('Error al timbrar factura');
    }
  };

  const handleGlobalSubmit = async (payload: any) => {
    try {
      await stampGlobalMutation.mutateAsync(payload);
      setIsGlobalModalOpen(false);
      alert('Factura Global timbrada con éxito (Simulado)');
    } catch (err) {
      alert('Error al timbrar factura global');
    }
  };

  const handleCancel = async (invoiceId: string) => {
    if (confirm('¿Estás seguro de solicitar la cancelación de este CFDI ante el SAT?')) {
      try {
        await cancelMutation.mutateAsync({ branchId: activeBranchId!, invoiceId });
        alert('Cancelación solicitada con éxito (Simulado)');
      } catch (err) {
        alert('Error al cancelar CFDI');
      }
    }
  };

  const handleDownload = (type: 'xml' | 'pdf', folio: string) => {
    alert(`Descargando ${type.toUpperCase()} de la factura ${folio} (Simulado)`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Facturación CFDI</h1>
          <p className="text-slate-500 text-sm mt-1">Timbrado de facturas individuales y factura global diaria.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsIndividualModalOpen(true)}
            className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-bold hover:bg-slate-50 transition-colors shadow-sm text-sm"
          >
            Factura Individual
          </button>
          <button
            onClick={() => setIsGlobalModalOpen(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-sm text-sm"
          >
            Factura Global del Día
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Cargando facturas...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Folio / UUID</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4 text-right">Monto Total</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((invoice: any) => (
                  <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 flex items-center gap-2">
                        {invoice.folio}
                        {invoice.type === 'global' && (
                          <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded uppercase">Global</span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 truncate max-w-[120px]" title={invoice.uuid}>
                        {invoice.uuid}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium">
                      {invoice.customerName}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {invoice.date}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-800">
                      ${invoice.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      {invoice.status === 'timbrada' ? (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium flex items-center w-fit gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Timbrada
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium flex items-center w-fit gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Cancelada
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {invoice.status === 'timbrada' ? (
                        <div className="flex justify-center gap-3">
                          <button onClick={() => handleDownload('pdf', invoice.folio)} className="text-slate-500 hover:text-slate-800 font-medium text-xs transition-colors" title="Descargar PDF">PDF</button>
                          <button onClick={() => handleDownload('xml', invoice.folio)} className="text-slate-500 hover:text-slate-800 font-medium text-xs transition-colors" title="Descargar XML">XML</button>
                          <button onClick={() => handleCancel(invoice.id)} className="text-red-500 hover:text-red-700 font-medium text-xs transition-colors">Cancelar</button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
                {invoices.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      No hay facturas emitidas recientemente.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <IndividualInvoiceModal
        branchId={activeBranchId!}
        isOpen={isIndividualModalOpen}
        isSubmitting={stampIndividualMutation.isPending}
        onClose={() => setIsIndividualModalOpen(false)}
        onSubmit={handleIndividualSubmit}
      />

      <GlobalInvoiceModal
        branchId={activeBranchId!}
        isOpen={isGlobalModalOpen}
        isSubmitting={stampGlobalMutation.isPending}
        onClose={() => setIsGlobalModalOpen(false)}
        onSubmit={handleGlobalSubmit}
      />
    </div>
  );
}
