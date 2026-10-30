import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { cloneDemoUserByRole } from '../lib/demoAuth';
import { useAuthStore } from '../stores/authStore';
import { ProtectedRoute } from './ProtectedRoute';

function renderGuard() {
  return render(
    <MemoryRouter initialEntries={['/app']}>
      <Routes>
        <Route path="/login" element={<div>login-page</div>} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <div>app-ok</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  it('bloqueia visitante sem sessão', async () => {
    renderGuard();
    expect(await screen.findByText('login-page')).toBeInTheDocument();
    expect(screen.queryByText('app-ok')).not.toBeInTheDocument();
  });

  it('bloqueia isAuthenticated true com user null', async () => {
    useAuthStore.setState({ isAuthenticated: true, user: null });
    renderGuard();
    expect(await screen.findByText('login-page')).toBeInTheDocument();
  });

  it('bloqueia isAuthenticated false com user preenchido', async () => {
    useAuthStore.setState({
      isAuthenticated: false,
      user: cloneDemoUserByRole('aluno'),
      simulatedRole: 'aluno',
    });
    renderGuard();
    expect(await screen.findByText('login-page')).toBeInTheDocument();
  });

  it('libera acesso quando a sessão é consistente', async () => {
    useAuthStore.getState().enterDemo('aluno');
    renderGuard();
    expect(await screen.findByText('app-ok')).toBeInTheDocument();
  });

  it('invalida o acesso após logout', async () => {
    useAuthStore.getState().enterDemo('professor');
    const { unmount } = renderGuard();
    expect(await screen.findByText('app-ok')).toBeInTheDocument();

    useAuthStore.getState().logout();
    unmount();
    renderGuard();
    expect(await screen.findByText('login-page')).toBeInTheDocument();
  });
});
