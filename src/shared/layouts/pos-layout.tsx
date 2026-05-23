import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import { useBranchStore } from '../stores/branch.store';
import { useCashStore } from '../stores/cash.store';

export function POSLayout() {
  const { user, logout } = useAuthStore();
  const { activeBranchName, clearActiveBranch } = useBranchStore();
  const { status } = useCashStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearActiveBranch();
    logout();
    navigate('/login');
  };

  const handleSwitchBranch = () => {
    clearActiveBranch();
    navigate('/app/select-branch');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="font-bold text-lg text-primary">Tortilla Plus POS</div>
          <div className="h-6 w-px bg-slate-200" />
          <div className="text-sm font-medium text-slate-700">
            Sucursal: <span className="font-bold">{activeBranchName}</span>
          </div>
          <button 
            onClick={handleSwitchBranch}
            className="text-xs text-primary hover:underline"
          >
            Cambiar
          </button>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${status === 'open' ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-slate-600">
              Caja {status === 'open' ? 'Abierta' : 'Cerrada'}
            </span>
          </div>
          <div className="text-sm font-medium text-slate-700">
            {user?.name}
          </div>
          <button 
            onClick={handleLogout}
            className="text-sm text-red-600 font-medium hover:text-red-800"
          >
            Salir
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col p-4 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
