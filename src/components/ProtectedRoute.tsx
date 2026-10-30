import { Navigate } from 'react-router-dom';
import { isValidAuthSession } from '../lib/demoAuth';
import { useAuthStore, useHasAuthHydrated } from '../stores/authStore';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const hydrated = useHasAuthHydrated();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!hydrated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-neutral-50"
        role="status"
        aria-live="polite"
      >
        <p className="text-sm text-neutral-500">Carregando sessão…</p>
      </div>
    );
  }

  if (!isValidAuthSession(isAuthenticated, user)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
