import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { useAuthStore } from '../stores/authStore';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';

function renderAppRoute(path: string, permission: 'users' | 'dashboard' | 'essayCreate') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/login" element={<div>login-page</div>} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <div>
                <RoleRoute permission={permission}>
                  <div>rota-ok</div>
                </RoleRoute>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/usuarios"
          element={
            <ProtectedRoute>
              <RoleRoute permission="users">
                <div>usuarios-ok</div>
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/redacoes/nova"
          element={
            <ProtectedRoute>
              <RoleRoute permission="essayCreate">
                <div>nova-ok</div>
              </RoleRoute>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('RoleRoute', () => {
  it('continua enviando visitante sem sessão para o login', async () => {
    renderAppRoute('/app/usuarios', 'users');
    expect(await screen.findByText('login-page')).toBeInTheDocument();
    expect(screen.queryByText('usuarios-ok')).not.toBeInTheDocument();
    expect(screen.queryByText('login-page')).toBeInTheDocument();
  });

  it('libera rota permitida ao perfil autenticado', async () => {
    useAuthStore.getState().enterDemo('admin');
    renderAppRoute('/app/usuarios', 'users');
    expect(await screen.findByText('usuarios-ok')).toBeInTheDocument();
  });

  it('nega acesso direto de aluno a usuários sem ir ao login', async () => {
    useAuthStore.getState().enterDemo('aluno');
    renderAppRoute('/app/usuarios', 'users');
    expect(await screen.findByText('Acesso não permitido')).toBeInTheDocument();
    expect(screen.queryByText('usuarios-ok')).not.toBeInTheDocument();
    expect(screen.queryByText('login-page')).not.toBeInTheDocument();
  });

  it('nega nova redação a professor', async () => {
    useAuthStore.getState().enterDemo('professor');
    renderAppRoute('/app/redacoes/nova', 'essayCreate');
    expect(await screen.findByText('Acesso não permitido')).toBeInTheDocument();
    expect(screen.queryByText('nova-ok')).not.toBeInTheDocument();
  });

  it('mantém a recusa após recriar a árvore (F5 / hidratação)', async () => {
    useAuthStore.getState().enterDemo('aluno');
    const { unmount } = renderAppRoute('/app/usuarios', 'users');
    expect(await screen.findByText('Acesso não permitido')).toBeInTheDocument();
    unmount();
    renderAppRoute('/app/usuarios', 'users');
    expect(await screen.findByText('Acesso não permitido')).toBeInTheDocument();
    expect(screen.queryByText('login-page')).not.toBeInTheDocument();
  });
});
