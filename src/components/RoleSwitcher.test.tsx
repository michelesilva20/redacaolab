import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { useAuthStore } from '../stores/authStore';
import { RoleSwitcher } from './RoleSwitcher';

describe('RoleSwitcher', () => {
  it('deixa explícito que os perfis são de demonstração e troca a identidade', async () => {
    const user = userEvent.setup();
    useAuthStore.getState().enterDemo('aluno');
    render(<RoleSwitcher />);

    await user.click(screen.getByRole('button', { name: /trocar perfil de demonstração/i }));
    expect(screen.getByText('Demonstração')).toBeInTheDocument();
    expect(screen.getByText(/usuários fictícios/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^admin/i }));

    const state = useAuthStore.getState();
    expect(state.user?.id).toBe('user-admin-1');
    expect(state.user?.role).toBe('admin');
    expect(state.simulatedRole).toBe('admin');
    expect(state.user?.email).toBe('admin@redacaolab.com');
  });
});
