import { useState } from 'react';
import { useBranchStore } from '../../../shared/stores/branch.store';
import { useCatalogProducts, useUpdatePrice } from '../hooks/use-manager-catalog';
import { PriceChangeModal } from '../components/price-change-modal';

export function PricesPage() {
  const { activeBranchId } = useBranchStore();
  
  // Obtenemos el catálogo filtrado por sucursal, que ya incluye el activePrice
  const { data: products = [], isLoading } = useCatalogProducts(activeBranchId);
  
  const updatePriceMutation = useUpdatePrice();

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const handleSubmit = async (payload: { branchId: string; productId: string; price: number }) => {
    try {
      await updatePriceMutation.mutateAsync(payload);
      setSelectedProduct(null);
    } catch (error) {
      alert('Error al actualizar el precio');
    }
  };

  // Solo mostrar productos activos en la configuración de precios
  const activeProducts = products.filter((p: any) => p.status === 'active');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Precios por Sucursal</h1>
          <p className="text-slate-500 text-sm mt-1">Configura a cuánto se venden los productos en <span className="font-bold text-slate-700">{activeBranchId === 'suc-1' ? 'Sucursal Principal' : 'Sucursal ' + activeBranchId}</span>.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Cargando precios...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Producto</th>
                  <th className="px-6 py-4">Tipo de Venta</th>
                  <th className="px-6 py-4 text-right">Precio Actual</th>
                  <th className="px-6 py-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeProducts.map((product: any) => {
                  const currentPrice = product.prices?.find((p: any) => p.branchId === activeBranchId)?.price || product.activePrice || 0;
                  
                  return (
                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{product.name}</div>
                        <div className="text-xs text-slate-400">Unidad: {product.unit}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 capitalize">
                        {product.productType}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-lg font-bold text-slate-900">
                          ${currentPrice.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="px-4 py-1.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-bold text-sm transition-colors shadow-sm"
                        >
                          Cambiar Precio
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {activeProducts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">
                      No hay productos activos para configurar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <PriceChangeModal
        product={selectedProduct}
        branchId={activeBranchId!}
        isSubmitting={updatePriceMutation.isPending}
        onClose={() => setSelectedProduct(null)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
