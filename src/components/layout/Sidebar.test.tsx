import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { getNavItemsForRole } from '../../lib/permissions';
import { useAuthStore } from '../../stores/authStore';
import { Sidebar } from './Sidebar';

function renderSidebar() {
  return render(
    <MemoryRouter initialEntries={['/app']}>
      <Sidebar />
    </MemoryRouter>
  );
}

describe('Sidebar e matriz central', () => {
  it('mostra só os itens permitidos ao aluno', () => {
    useAuthStore.getState().enterDemo('aluno');
    renderSidebar();

    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Redações' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Turmas' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Usuários' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Relatórios' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Configurações' })).not.toBeInTheDocument();

    const labels = getNavItemsForRole('aluno').map((item) => item.label);
    for (const label of labels) {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument();
    }
  });

  it('esconde administração de usuários do professor', () => {
    useAuthStore.getState().enterDemo('professor');
    renderSidebar();

    expect(screen.getByRole('link', { name: 'Turmas' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Relatórios' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Usuários' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Configurações' })).not.toBeInTheDocument();
  });

  it('atualiza o menu imediatamente ao trocar o perfil', () => {
    useAuthStore.getState().enterDemo('aluno');
    const { rerender } = renderSidebar();

    expect(screen.queryByRole('link', { name: 'Usuários' })).not.toBeInTheDocument();
    useAuthStore.getState().setSimulatedRole('admin');
    rerender(
      <MemoryRouter initialEntries={['/app']}>
        <Sidebar />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: 'Usuários' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Configurações' })).toBeInTheDocument();
  });
});
