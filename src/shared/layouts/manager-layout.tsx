import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import { ManagerSidebar } from '../../modules/manager/components/manager-sidebar';
import { ManagerTopbar } from '../../modules/manager/components/manager-topbar';

export function ManagerLayout() {
  const { user } = useAuthStore();

  // Basic role check. In real app we might use PermissionGuard
  if (user?.roles && !user.roles.some(r => ['admin', 'supervisor', 'organization_owner'].includes(r))) {
    return <Navigate to="/app/pos" replace />;
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
      <ManagerSidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <ManagerTopbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
