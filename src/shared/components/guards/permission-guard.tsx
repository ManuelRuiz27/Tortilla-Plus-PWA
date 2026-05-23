import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';

interface PermissionGuardProps {
  permission: string;
  children?: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

export function PermissionGuard({ permission, children, fallback = null, redirectTo }: PermissionGuardProps) {
  const { user } = useAuthStore();
  
  // Check for permission or if the user is the organization owner
  const hasPermission = user?.permissions?.includes(permission) || user?.roles?.includes('organization_owner');

  if (!hasPermission) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
