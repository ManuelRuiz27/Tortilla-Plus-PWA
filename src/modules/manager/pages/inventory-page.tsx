import { useState } from 'react';
import { useBranchStore } from '../../../shared/stores/branch.store';
import { useInventory, useAdjustInventory, useProductionEntry } from '../hooks/use-manager-inventory';
import { InventoryAdjustmentModal } from '../components/inventory-adjustment-modal';
import { ProductionEntryModal } from '../components/production-entry-modal';

export function InventoryPage() {
  const { activeBranchId } = useBranchStore();
  const { data: inventory = [], isLoading } = useInventory(activeBranchId);
  
  const adjustMutation = useAdjustInventory();
  const productionMutation = useProductionEntry();

  const [adjustmentItem, setAdjustmentItem] = useState<any | null>(null);
  const [productionItem, setProductionItem] = useState<any | null>(null);

  const handleAdjustSubmit = async (payload: any) => {
    try {
      await adjustMutation.mutateAsync(payload);
      setAdjustmentItem(null);
    } catch (err) {
      alert('Error al guardar ajuste');
    }
  };

  const handleProductionSubmit = async (payload: any) => {
    try {
      await productionMutation.mutateAsync(payload);
      setProductionItem(null);
    } catch (err) {
      alert('Error al registrar producción');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Inventario y Producción</h1>
          <p className="text-slate-500 text-sm mt-1">Supervisa existencias, registra mermas y entradas de producción.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Cargando inventario...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Producto</th>
                  <th className="px-6 py-4">Stock Actual</th>
                  <th className="px-6 py-4">Mínimo Ideal</th>
                  <th className="px-6 py-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inventory.map((item: any) => {
                  const isLow = item.stock <= item.minStock && item.stock > 0;
                  const isNegative = item.stock <= 0;
                  
                  return (
                    <tr key={item.productId} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{item.name}</div>
                        <div className="text-xs text-slate-500">ID: {item.productId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-lg font-bold ${isNegative ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-slate-900'}`}>
                            {item.stock} {item.unit}
                          </span>
                          {isNegative && <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Agotado</span>}
                          {isLow && <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Bajo</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {item.minStock} {item.unit}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => setAdjustmentItem(item)}
                            className="px-3 py-1.5 border border-slate-300 rounded text-slate-600 hover:bg-slate-100 font-medium text-xs transition-colors"
                          >
                            Ajuste/Merma
                          </button>
                          
                          {/* Solo mostrar Producción para Tortilla y Masa (simulado con unit kg) */}
                          {item.unit === 'kg' && (
                            <button
                              onClick={() => setProductionItem(item)}
                              className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100 font-medium text-xs transition-colors"
                            >
                              + Producción
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <InventoryAdjustmentModal
        item={adjustmentItem}
        branchId={activeBranchId!}
        isSubmitting={adjustMutation.isPending}
        onClose={() => setAdjustmentItem(null)}
        onSubmit={handleAdjustSubmit}
      />

      <ProductionEntryModal
        item={productionItem}
        branchId={activeBranchId!}
        isSubmitting={productionMutation.isPending}
        onClose={() => setProductionItem(null)}
        onSubmit={handleProductionSubmit}
      />
    </div>
  );
}
