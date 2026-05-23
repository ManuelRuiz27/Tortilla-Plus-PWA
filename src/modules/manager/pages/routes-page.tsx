import { useState } from 'react';
import { useBranchStore } from '../../../shared/stores/branch.store';
import { useRoutes, useStartRoute, useSettleRoute } from '../hooks/use-manager-commercial';
import { RouteSettlementModal } from '../components/route-settlement-modal';

export function RoutesPage() {
  const { activeBranchId } = useBranchStore();
  const { data: routes = [], isLoading } = useRoutes(activeBranchId);
  
  const startRouteMutation = useStartRoute();
  const settleRouteMutation = useSettleRoute();

  const [settlementRoute, setSettlementRoute] = useState<any | null>(null);

  const handleStartRoute = async (routeId: string) => {
    if (confirm('¿Estás seguro de iniciar esta ruta? El inventario cargado saldrá de la sucursal.')) {
      try {
        await startRouteMutation.mutateAsync(routeId);
        alert('Ruta iniciada con éxito');
      } catch (err) {
        alert('Error al iniciar la ruta');
      }
    }
  };

  const handleSettleSubmit = async (payload: { cashCollected: number; returnedWaste: number }) => {
    if (!settlementRoute) return;
    try {
      await settleRouteMutation.mutateAsync({
        routeId: settlementRoute.id,
        payload
      });
      setSettlementRoute(null);
      alert('Liquidación registrada y cerrada exitosamente');
    } catch (err) {
      alert('Error al liquidar la ruta');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Rutas de Reparto</h1>
          <p className="text-slate-500 text-sm mt-1">Control de logística, salidas, mermas y liquidaciones.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {isLoading && <div className="col-span-full p-8 text-center text-slate-500">Cargando rutas...</div>}
        
        {routes.map((route: any) => (
          <div key={route.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className={`h-2 w-full ${
              route.status === 'completada' ? 'bg-slate-300' :
              route.status === 'en_camino' ? 'bg-blue-500' : 'bg-amber-400'
            }`}></div>
            
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{route.name}</h3>
                  <p className="text-sm font-medium text-slate-500 flex items-center gap-1 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1 .4-1 1v10h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                    {route.driverName}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${
                  route.status === 'completada' ? 'bg-slate-100 text-slate-500' :
                  route.status === 'en_camino' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {route.status.replace('_', ' ')}
                </span>
              </div>

              {route.status === 'en_camino' && (
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 mb-4">
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Efectivo Acumulado Estimado</p>
                  <p className="text-xl font-bold text-slate-800">${route.expectedCash.toFixed(2)}</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 mt-auto">
              {route.status === 'preparando' && (
                <button
                  onClick={() => handleStartRoute(route.id)}
                  disabled={startRouteMutation.isPending}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors text-sm"
                >
                  Confirmar Salida de Ruta
                </button>
              )}
              {route.status === 'en_camino' && (
                <button
                  onClick={() => setSettlementRoute(route)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-sm"
                >
                  Realizar Liquidación
                </button>
              )}
              {route.status === 'completada' && (
                <button
                  disabled
                  className="w-full py-2 bg-slate-200 text-slate-500 font-bold rounded-lg text-sm opacity-50 cursor-not-allowed"
                >
                  Ruta Cerrada
                </button>
              )}
            </div>
          </div>
        ))}

        {!isLoading && routes.length === 0 && (
          <div className="col-span-full p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
            No hay rutas activas para esta sucursal.
          </div>
        )}
      </div>

      <RouteSettlementModal
        route={settlementRoute}
        isOpen={!!settlementRoute}
        isSubmitting={settleRouteMutation.isPending}
        onClose={() => setSettlementRoute(null)}
        onSubmit={handleSettleSubmit}
      />
    </div>
  );
}
