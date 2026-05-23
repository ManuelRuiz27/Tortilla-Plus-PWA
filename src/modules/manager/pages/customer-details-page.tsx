import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCustomerDetails, useUpdateSpecialPrice } from '../hooks/use-manager-commercial';
import { useBranchStore } from '../../../shared/stores/branch.store';
import { useCatalogProducts } from '../hooks/use-manager-catalog';

export function CustomerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { activeBranchId } = useBranchStore();

  const { data: customer, isLoading } = useCustomerDetails(id || null);
  const { data: products = [] } = useCatalogProducts(activeBranchId);
  const updatePriceMutation = useUpdateSpecialPrice();

  const [selectedProductId, setSelectedProductId] = useState('');
  const [specialPrice, setSpecialPrice] = useState('');

  const handleAddSpecialPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !specialPrice) return;

    try {
      await updatePriceMutation.mutateAsync({
        customerId: id!,
        productId: selectedProductId,
        price: parseFloat(specialPrice)
      });
      setSelectedProductId('');
      setSpecialPrice('');
    } catch (err) {
      alert('Error al asignar precio especial');
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Cargando detalles del cliente...</div>;
  }

  if (!customer) {
    return <div className="p-8 text-center text-red-500">Cliente no encontrado</div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/app/manager/customers')}
          className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{customer.name}</h1>
          <p className="text-slate-500 text-sm mt-1">Detalles de la cuenta comercial</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Estado de Cuenta */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4">Estado de Cuenta</h3>
            {customer.hasCredit ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Saldo Deudor</p>
                  <p className="text-3xl font-bold text-red-600">${customer.balance.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Límite de Crédito</p>
                  <p className="text-xl font-semibold text-slate-800">${customer.creditLimit.toFixed(2)}</p>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 mt-2">
                  <div 
                    className="bg-red-500 h-2.5 rounded-full" 
                    style={{ width: `${Math.min((customer.balance / customer.creditLimit) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="text-slate-500 text-sm">El cliente opera de riguroso contado. No se le ha asignado crédito comercial.</div>
            )}
          </div>

          {/* Precios Especiales */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4">Precios Especiales</h3>
            
            <form onSubmit={handleAddSpecialPrice} className="space-y-3 mb-6 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="text-sm font-medium text-slate-700">Añadir Precio</div>
              <select 
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded px-2 py-1.5 focus:outline-none focus:ring-primary focus:border-primary bg-white"
                required
              >
                <option value="">Selecciona Producto...</option>
                {products.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  step="0.5"
                  value={specialPrice}
                  onChange={(e) => setSpecialPrice(e.target.value)}
                  placeholder="Precio $"
                  className="w-full text-sm border border-slate-300 rounded px-2 py-1.5 focus:outline-none focus:ring-primary focus:border-primary"
                  required
                />
                <button 
                  type="submit"
                  disabled={updatePriceMutation.isPending}
                  className="bg-primary text-white px-3 rounded text-sm font-bold hover:bg-primary/90 disabled:opacity-50"
                >
                  Guardar
                </button>
              </div>
            </form>

            <div className="space-y-3">
              {customer.specialPrices?.map((sp: any) => (
                <div key={sp.productId} className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-sm font-medium text-slate-700">{sp.productName}</span>
                  <span className="text-sm font-bold text-green-600">${sp.price.toFixed(2)}</span>
                </div>
              ))}
              {(!customer.specialPrices || customer.specialPrices.length === 0) && (
                <p className="text-sm text-slate-400 text-center">No hay precios especiales asignados.</p>
              )}
            </div>
          </div>
        </div>

        {/* Historial de Movimientos */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Historial Reciente (Simulado)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200 text-xs">
                  <tr>
                    <th className="px-6 py-3">Fecha</th>
                    <th className="px-6 py-3">Descripción</th>
                    <th className="px-6 py-3 text-right">Cargo</th>
                    <th className="px-6 py-3 text-right">Abono</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customer.recentTransactions?.map((tx: any) => (
                    <tr key={tx.id} className="hover:bg-slate-50">
                      <td className="px-6 py-3 text-slate-600">{tx.date}</td>
                      <td className="px-6 py-3 text-slate-800 font-medium">{tx.description}</td>
                      <td className="px-6 py-3 text-right text-red-600 font-bold">
                        {tx.type === 'charge' ? `$${tx.amount.toFixed(2)}` : '-'}
                      </td>
                      <td className="px-6 py-3 text-right text-green-600 font-bold">
                        {tx.type === 'payment' ? `$${tx.amount.toFixed(2)}` : '-'}
                      </td>
                    </tr>
                  ))}
                  {(!customer.recentTransactions || customer.recentTransactions.length === 0) && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-500">
                        No hay movimientos recientes.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
