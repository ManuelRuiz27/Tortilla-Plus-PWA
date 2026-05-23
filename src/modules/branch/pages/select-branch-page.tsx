import { useNavigate } from 'react-router-dom';
import { useBranchStore, type UserBranch } from '../../../shared/stores/branch.store';
import { useAuthStore } from '../../../shared/stores/auth.store';

export function SelectBranchPage() {
  const { setActiveBranch } = useBranchStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Extraer las sucursales reales del usuario logueado
  const branches: UserBranch[] = user?.branches || [];

  const handleSelect = (branch: UserBranch) => {
    setActiveBranch(branch);
    
    // Redirect based on role
    const isManager = user?.roles?.includes('organization_owner') || user?.roles?.includes('supervisor');
    
    if (isManager) {
      navigate('/app/manager');
    } else {
      navigate('/app/pos');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-slate-900 mb-8">
          Selecciona una Sucursal
        </h1>
        
        <div className="grid gap-4">
          {branches.length === 0 && (
            <div className="text-center text-slate-500 py-4">
              No tienes sucursales asignadas.
            </div>
          )}
          {branches.map((branch) => (
            <button
              key={branch.id}
              onClick={() => handleSelect(branch)}
              className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-primary hover:ring-1 hover:ring-primary text-left transition-all group"
            >
              <div className="font-semibold text-lg text-slate-900 group-hover:text-primary">
                {branch.name}
              </div>
              <div className="text-sm text-slate-500 mt-1">
                Haz clic para operar en esta sucursal
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
