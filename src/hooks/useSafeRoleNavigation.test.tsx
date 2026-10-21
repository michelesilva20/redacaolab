import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { useSafeRoleNavigation } from './useSafeRoleNavigation';
import { RoleRoute } from '../components/RoleRoute';
import { useAuthStore } from '../stores/authStore';

function Harness() {
  useSafeRoleNavigation();
  return (
    <Routes>
      <Route
        path="/app"
        element={
          <RoleRoute permission="dashboard">
            <div>dashboard-ok</div>
          </RoleRoute>
        }
      />
      <Route
        path="/app/usuarios"
        element={
          <RoleRoute permission="users">
            <div>usuarios-ok</div>
          </RoleRoute>
        }
      />
    </Routes>
  );
}

describe('useSafeRoleNavigation', () => {
  it('leva a um caminho permitido ao trocar de perfil em rota restrita', async () => {
    useAuthStore.getState().enterDemo('admin');
    render(
      <MemoryRouter initialEntries={['/app/usuarios']}>
        <Harness />
      </MemoryRouter>
    );

    expect(await screen.findByText('usuarios-ok')).toBeInTheDocument();

    useAuthStore.getState().setSimulatedRole('aluno');
    expect(await screen.findByText('dashboard-ok')).toBeInTheDocument();
    expect(screen.queryByText('usuarios-ok')).not.toBeInTheDocument();
  });

  it('não cria loop ao permanecer em rota já permitida', async () => {
    const user = userEvent.setup();
    useAuthStore.getState().enterDemo('aluno');
    render(
      <MemoryRouter initialEntries={['/app']}>
        <Harness />
        <button type="button" onClick={() => useAuthStore.getState().setSimulatedRole('professor')}>
          virar-professor
        </button>
      </MemoryRouter>
    );

    expect(await screen.findByText('dashboard-ok')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'virar-professor' }));
    expect(screen.getByText('dashboard-ok')).toBeInTheDocument();
  });
});
