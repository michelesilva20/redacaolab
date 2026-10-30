import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SAFE_FALLBACK_PATH, canAccessPath } from '../lib/permissions';
import { useAuthStore } from '../stores/authStore';

export function useSafeRoleNavigation() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const role = useAuthStore((state) => state.user?.role);
  const previousRole = useRef(role);

  useEffect(() => {
    const roleChanged = previousRole.current !== role;
    previousRole.current = role;

    if (roleChanged && role && !canAccessPath(role, pathname)) {
      navigate(SAFE_FALLBACK_PATH, { replace: true });
    }
  }, [navigate, pathname, role]);
}
