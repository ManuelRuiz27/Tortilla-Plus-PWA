import { Navigate, Outlet } from 'react-router-dom';
import { useBranchStore } from '../../stores/branch.store';

export function BranchGuard() {
  const { activeBranchId } = useBranchStore();

  if (!activeBranchId) {
    return <Navigate to="/app/select-branch" replace />;
  }

  return <Outlet />;
}
