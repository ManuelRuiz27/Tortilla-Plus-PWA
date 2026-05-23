import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomers, useCreateCustomer, useUpdateCustomer } from '../hooks/use-manager-commercial';
import { CustomerFormModal } from '../components/customer-form-modal';

export function CustomersPage() {
  const navigate = useNavigate();
  const { data: customers = [], isLoading } = useCustomers();
  
  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any | null>(null);

  const handleOpenNew = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (customer: any) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleSubmit = async (customerData: any) => {
    try {
      if (editingCustomer) {
        await updateMutation.mutateAsync({ id: editingCustomer.id, customer: customerData });
      } else {
        await createMutation.mutateAsync(customerData);
      }
      setIsModalOpen(false);
    } catch (error) {
      alert('Error al guardar el cliente');
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Cartera de Clientes</h1>
          <p className="text-slate-500 text-sm mt-1">Gestiona los clientes recurrentes y sus créditos.</p>
        </div>
        <button
          onClick={handleOpenNew}
          className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
          Nuevo Cliente
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Cargando clientes...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Crédito</th>
                  <th className="px-6 py-4 text-right">Saldo Deudor</th>
                  <th className="px-6 py-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((customer: any) => {
                  const balancePercent = customer.hasCredit && customer.creditLimit > 0 
                    ? (customer.balance / customer.creditLimit) * 100 
                    : 0;
                  const isHighBalance = balancePercent > 80;

                  return (
                    <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{customer.name}</div>
                        <div className="text-xs text-slate-400">Tel: {customer.phone || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        {customer.hasCredit ? (
                          <div>
                            <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Autorizado</span>
                            <div className="text-xs text-slate-500 mt-1">Límite: ${customer.creditLimit}</div>
                          </div>
                        ) : (
                          <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Contado</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {customer.hasCredit ? (
                          <div>
                            <div className={`text-lg font-bold ${isHighBalance ? 'text-red-600' : 'text-slate-900'}`}>
                              ${customer.balance.toFixed(2)}
                            </div>
                            {isHighBalance && (
                              <div className="text-[10px] text-red-500 font-bold uppercase">Límite Próximo</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => handleOpenEdit(customer)}
                            className="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => navigate(`/app/manager/customers/${customer.id}`)}
                            className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors"
                          >
                            Detalles
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {customers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">
                      No hay clientes registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <CustomerFormModal
          key={editingCustomer ? editingCustomer.id : 'new'}
          customer={editingCustomer}
          isOpen={isModalOpen}
          isSubmitting={isSubmitting}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
