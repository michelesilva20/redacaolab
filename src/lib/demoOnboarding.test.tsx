import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AppLayout } from '../components/layout/AppLayout';
import { OnboardingModal } from '../components/onboarding/OnboardingModal';
import { Login } from '../pages/Login';
import { cloneDemoUserByRole } from './demoAuth';
import {
  hasCompletedDemoOnboarding,
  markDemoOnboardingComplete,
  resetDemoOnboardingForTests,
} from './demoOnboarding';
import { useAuthStore } from '../stores/authStore';

function renderApp() {
  return render(
    <MemoryRouter initialEntries={['/app']}>
      <AppLayout />
    </MemoryRouter>
  );
}

describe('onboarding demonstrativo', () => {
  it('aparece no primeiro acesso do aluno e some após concluir', async () => {
    const user = userEvent.setup();
    useAuthStore.getState().enterDemo('aluno');
    expect(useAuthStore.getState().user?.onboardingCompleted).toBe(false);

    render(<OnboardingModal />);
    expect(screen.getByTestId('onboarding-overlay')).toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: /qual é o seu objetivo/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /enem exame nacional/i }));
    await user.click(screen.getByRole('button', { name: 'Continuar' }));
    await user.click(screen.getByRole('button', { name: 'Continuar' }));
    await user.click(await screen.findByRole('button', { name: 'Seg' }));
    await user.click(screen.getByRole('button', { name: 'Começar!' }));

    expect(useAuthStore.getState().user?.onboardingCompleted).toBe(true);
    expect(hasCompletedDemoOnboarding('user-aluno-1')).toBe(true);
  });

  it('persiste a conclusão após F5 e ao voltar do professor', () => {
    markDemoOnboardingComplete('user-aluno-1');

    useAuthStore.getState().enterDemo('aluno');
    expect(useAuthStore.getState().user?.onboardingCompleted).toBe(true);

    useAuthStore.getState().setSimulatedRole('professor');
    expect(useAuthStore.getState().user?.role).toBe('professor');

    useAuthStore.getState().setSimulatedRole('admin');
    useAuthStore.getState().setSimulatedRole('aluno');
    expect(useAuthStore.getState().user?.id).toBe('user-aluno-1');
    expect(useAuthStore.getState().user?.onboardingCompleted).toBe(true);

    const cloned = cloneDemoUserByRole('aluno');
    expect(cloned.onboardingCompleted).toBe(true);
    expect(cloned).not.toBe(useAuthStore.getState().user);
  });

  it('não deixa overlay após conclusão e não intercepta cliques', () => {
    markDemoOnboardingComplete('user-aluno-1');
    useAuthStore.getState().enterDemo('aluno');
    renderApp();

    expect(screen.queryByTestId('onboarding-overlay')).not.toBeInTheDocument();
    expect(document.querySelector('[data-testid="onboarding-overlay"]')).toBeNull();
    expect(screen.getByRole('link', { name: 'Redações' })).toBeEnabled();
  });

  it('não mistura onboarding com professor e mantém o login demo', async () => {
    resetDemoOnboardingForTests();
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /professor\s+corretor/i }));
    await user.click(screen.getByRole('button', { name: /entrar como professor/i }));
    expect(useAuthStore.getState().user?.role).toBe('professor');
    expect(hasCompletedDemoOnboarding('user-prof-1')).toBe(false);
  });
});
