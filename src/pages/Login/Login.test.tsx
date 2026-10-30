import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { useAuthStore } from '../../stores/authStore';
import { Login } from './index';

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
}

describe('Login demonstrativo', () => {
  it('não pede credenciais reais', () => {
    renderLogin();

    expect(screen.getByText('Explorar a demonstração')).toBeInTheDocument();
    expect(screen.getByText(/nenhuma senha é necessária/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/e-mail/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/senha/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^entrar$/i })).not.toBeInTheDocument();
  });

  it('entra com o perfil fictício selecionado', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole('button', { name: /professor\s+corretor/i }));
    await user.click(screen.getByRole('button', { name: /entrar como professor/i }));

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.id).toBe('user-prof-1');
    expect(state.user?.role).toBe('professor');
    expect(state.simulatedRole).toBe('professor');
  });
});
