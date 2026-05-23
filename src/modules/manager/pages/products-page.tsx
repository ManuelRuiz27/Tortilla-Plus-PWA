import { useState } from 'react';
import { useBranchStore } from '../../../shared/stores/branch.store';
import { useCatalogProducts, useCreateProduct, useUpdateProduct } from '../hooks/use-manager-catalog';
import { ProductFormModal } from '../components/product-form-modal';

export function ProductsPage() {
  const { activeBranchId } = useBranchStore();
  const { data: products = [], isLoading } = useCatalogProducts(activeBranchId);
  
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const handleOpenNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSubmit = async (productData: any) => {
    try {
      if (editingProduct) {
        await updateMutation.mutateAsync({ id: editingProduct.id, product: productData });
      } else {
        await createMutation.mutateAsync(productData);
      }
      setIsModalOpen(false);
    } catch (error) {
      alert('Error al guardar el producto');
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Catálogo de Productos</h1>
          <p className="text-slate-500 text-sm mt-1">Administra los productos globales para todas las sucursales.</p>
        </div>
        <button
          onClick={handleOpenNew}
          className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
          Nuevo Producto
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Cargando catálogo...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Nombre Comercial</th>
                  <th className="px-6 py-4">Tipo</th>
                  <th className="px-6 py-4">Unidad</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product: any) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{product.name}</div>
                      <div className="text-xs text-slate-400">ID: {product.id}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 capitalize">
                      {product.productType === 'retail' ? 'Abarrote (Retail)' : product.productType}
                    </td>
                    <td className="px-6 py-4 text-slate-600 uppercase">
                      {product.unit}
                    </td>
                    <td className="px-6 py-4">
                      {product.status === 'active' ? (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">Activo</span>
                      ) : (
                        <span className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded-full font-medium">Inactivo</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      No hay productos registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <ProductFormModal
          key={editingProduct ? editingProduct.id : 'new'}
          product={editingProduct}
          isOpen={isModalOpen}
          isSubmitting={isSubmitting}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
