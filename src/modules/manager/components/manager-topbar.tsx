import { useBranchStore } from '../../../shared/stores/branch.store';
import { useAuthStore } from '../../../shared/stores/auth.store';
import { Link, useNavigate } from 'react-router-dom';

export function ManagerTopbar() {
  const { activeBranchId, clearActiveBranch } = useBranchStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleSwitchBranch = () => {
    clearActiveBranch();
    navigate('/app/select-branch');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
      <div className="flex items-center gap-4">
        {/* En móvil mostrar botón de hamburguesa (simplificado) */}
        <button className="md:hidden text-slate-500 hover:text-slate-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>

        <div className="flex flex-col">
          <span className="text-xs text-slate-500 font-medium">Sucursal Activa</span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">{activeBranchId === 'suc-1' ? 'Sucursal Principal' : 'Sucursal ' + activeBranchId}</span>
            <button onClick={handleSwitchBranch} className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded hover:bg-primary/20 transition-colors">Cambiar</button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <Link to="/app/pos" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors hidden sm:block">
          Ir al POS (Caja)
        </Link>
        
        <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800">{user?.name || 'Gerente'}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.roles?.[0] || 'admin'}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-600 font-bold">
            {(user?.name || 'G').charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
