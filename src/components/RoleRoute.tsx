import { hasPermission, type Permission } from '../lib/permissions';
import { useAuthStore } from '../stores/authStore';
import { ForbiddenPage } from './ForbiddenPage';

interface RoleRouteProps {
  permission: Permission;
  children: React.ReactNode;
}

export function RoleRoute({ permission, children }: RoleRouteProps) {
  const role = useAuthStore((state) => state.user?.role);

  if (!hasPermission(role, permission)) {
    return <ForbiddenPage />;
  }

  return <>{children}</>;
}
