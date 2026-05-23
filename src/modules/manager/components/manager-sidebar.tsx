import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../shared/stores/auth.store';
import { useBranchStore } from '../../../shared/stores/branch.store';

export function ManagerSidebar() {
  const { logout } = useAuthStore();
  const { clearActiveBranch } = useBranchStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearActiveBranch();
    logout();
    navigate('/login');
  };

  const menuItems = [
    { to: '/app/manager/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/app/manager/cash', label: 'Caja Operativa', icon: '💵' },
    { to: '/app/manager/inventory', label: 'Inventario', icon: '📦' },
    { to: '/app/manager/products', label: 'Productos', icon: '🌮' },
    { to: '/app/manager/prices', label: 'Precios', icon: '🏷️' },
    { to: '/app/manager/customers', label: 'Clientes', icon: '👥' },
    { to: '/app/manager/routes', label: 'Rutas', icon: '🚚' },
    { to: '/app/manager/billing', label: 'Facturación', icon: '🧾' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <span className="text-xl font-bold text-white tracking-tight">Tortilla<span className="text-primary">Plus</span> MGR</span>
      </div>
      
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">
          Operación Principal
        </div>
        
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors w-full px-2 py-2 rounded-lg hover:bg-slate-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
