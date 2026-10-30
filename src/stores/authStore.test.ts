import { beforeEach, describe, expect, it } from 'vitest';
import { getUserByRole } from '../mocks/users';
import { AUTH_STORAGE_KEY } from '../lib/demoAuth';
import { resetAuthStoreForTests, useAuthStore } from './authStore';

describe('authStore demo roles', () => {
  beforeEach(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    resetAuthStoreForTests();
  });

  it('enterDemo autentica com o mock do papel escolhido', () => {
    useAuthStore.getState().enterDemo('professor');
    const state = useAuthStore.getState();

    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.id).toBe('user-prof-1');
    expect(state.user?.role).toBe('professor');
    expect(state.simulatedRole).toBe('professor');
    expect(state.user?.email).toBe('maria@redacaolab.com');
  });

  it('setSimulatedRole troca a identidade completa sem reaproveitar o usuário anterior', () => {
    useAuthStore.getState().enterDemo('aluno');
    useAuthStore.getState().setSimulatedRole('professor');
    let state = useAuthStore.getState();

    expect(state.user).toMatchObject({
      id: 'user-prof-1',
      role: 'professor',
      name: 'Prof. Maria Santos',
      email: 'maria@redacaolab.com',
      xp: 8500,
    });
    expect(state.simulatedRole).toBe('professor');

    useAuthStore.getState().setSimulatedRole('admin');
    useAuthStore.getState().setSimulatedRole('aluno');
    useAuthStore.getState().setSimulatedRole('professor');
    state = useAuthStore.getState();

    expect(state.user?.id).toBe('user-prof-1');
    expect(state.user?.role).toBe('professor');
    expect(state.simulatedRole).toBe('professor');
    expect(state.user?.preferences.weeklyGoal).toBe(10);
  });

  it('não muta os objetos originais dos mocks', () => {
    useAuthStore.getState().enterDemo('aluno');
    const storeUser = useAuthStore.getState().user!;
    storeUser.xp = 1;
    storeUser.name = 'Nome adulterado';

    expect(getUserByRole('aluno').xp).toBe(2400);
    expect(getUserByRole('aluno').name).toBe('João Pedro');
    expect(useAuthStore.getState().user).not.toBe(getUserByRole('aluno'));
  });

  it('logout invalida o acesso e troca de papel sem sessão não cria usuário', () => {
    useAuthStore.getState().enterDemo('admin');
    useAuthStore.getState().logout();

    let state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();

    useAuthStore.getState().setSimulatedRole('professor');
    state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.simulatedRole).toBe('professor');
  });

  it('persiste sessão coerente e repara identidade misturada no rehydrate', async () => {
    useAuthStore.getState().enterDemo('aluno');
    const persisted = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) ?? '{}');
    expect(persisted.state.user.id).toBe('user-aluno-1');
    expect(persisted.state.isAuthenticated).toBe(true);

    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        state: {
          user: { ...getUserByRole('aluno'), role: 'admin' },
          isAuthenticated: true,
          isSimulatedMode: true,
          simulatedRole: 'admin',
        },
        version: 0,
      })
    );

    await useAuthStore.persist.rehydrate();
    const state = useAuthStore.getState();

    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.id).toBe('user-admin-1');
    expect(state.user?.role).toBe('admin');
    expect(state.user?.name).toBe('Admin Silva');
    expect(state.simulatedRole).toBe('admin');
  });
});
