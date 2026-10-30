import { hasPermission, type Permission } from '../lib/permissions';
import { useAuthStore } from '../stores/authStore';

interface IfCanProps {
  permission: Permission;
  children: React.ReactNode;
}

export function IfCan({ permission, children }: IfCanProps) {
  const role = useAuthStore((state) => state.user?.role);

  if (!hasPermission(role, permission)) {
    return null;
  }

  return <>{children}</>;
}
