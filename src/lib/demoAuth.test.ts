import { describe, expect, it } from 'vitest';
import { getUserByRole } from '../mocks/users';
import {
  cloneDemoUserByRole,
  isConsistentDemoIdentity,
  isValidAuthSession,
  isValidRole,
  repairAuthState,
  resolveDemoRole,
} from './demoAuth';

describe('isValidAuthSession', () => {
  const user = cloneDemoUserByRole('aluno');

  it('rejeita usuário não autenticado', () => {
    expect(isValidAuthSession(false, null)).toBe(false);
  });

  it('rejeita isAuthenticated true com user null', () => {
    expect(isValidAuthSession(true, null)).toBe(false);
  });

  it('rejeita isAuthenticated false com user preenchido', () => {
    expect(isValidAuthSession(false, user)).toBe(false);
  });

  it('aceita estado consistente', () => {
    expect(isValidAuthSession(true, user)).toBe(true);
  });
});

describe('cloneDemoUserByRole', () => {
  it('carrega o aluno, professor e admin canônicos sem mutar o mock', () => {
    const aluno = cloneDemoUserByRole('aluno');
    const professor = cloneDemoUserByRole('professor');
    const admin = cloneDemoUserByRole('admin');

    expect(aluno).toMatchObject({ id: 'user-aluno-1', role: 'aluno', name: 'João Pedro' });
    expect(professor).toMatchObject({ id: 'user-prof-1', role: 'professor', name: 'Prof. Maria Santos' });
    expect(admin).toMatchObject({ id: 'user-admin-1', role: 'admin', name: 'Admin Silva' });

    expect(aluno).not.toBe(getUserByRole('aluno'));
    aluno.xp = 0;
    aluno.preferences.targetExam = 'unesp';
    expect(getUserByRole('aluno').xp).toBe(2400);
    expect(getUserByRole('aluno').preferences.targetExam).toBe('enem');
  });
});

describe('repairAuthState', () => {
  it('encerra sessão quando as flags de auth estão inconsistentes', () => {
    const mixed = repairAuthState({
      user: cloneDemoUserByRole('aluno'),
      isAuthenticated: false,
      isSimulatedMode: true,
      simulatedRole: 'aluno',
    });
    const missingUser = repairAuthState({
      user: null,
      isAuthenticated: true,
      isSimulatedMode: true,
      simulatedRole: 'professor',
    });

    expect(mixed).toMatchObject({ user: null, isAuthenticated: false, simulatedRole: 'aluno' });
    expect(missingUser).toMatchObject({ user: null, isAuthenticated: false, simulatedRole: 'professor' });
  });

  it('substitui identidade misturada pelo mock do papel simulado', () => {
    const aluno = cloneDemoUserByRole('aluno');
    const repaired = repairAuthState({
      user: { ...aluno, role: 'professor' },
      isAuthenticated: true,
      isSimulatedMode: true,
      simulatedRole: 'professor',
    });

    expect(repaired.isAuthenticated).toBe(true);
    expect(repaired.user?.id).toBe('user-prof-1');
    expect(repaired.user?.role).toBe('professor');
    expect(repaired.user?.name).toBe('Prof. Maria Santos');
    expect(repaired.simulatedRole).toBe('professor');
    expect(isConsistentDemoIdentity(repaired.user!, 'professor')).toBe(true);
  });

  it('preserva XP da mesma identidade após recarregar', () => {
    const aluno = cloneDemoUserByRole('aluno');
    aluno.xp = 3100;
    aluno.onboardingCompleted = true;

    const repaired = repairAuthState({
      user: aluno,
      isAuthenticated: true,
      isSimulatedMode: true,
      simulatedRole: 'aluno',
    });

    expect(repaired.user?.id).toBe('user-aluno-1');
    expect(repaired.user?.xp).toBe(3100);
    expect(repaired.user?.onboardingCompleted).toBe(true);
    expect(repaired.user).not.toBe(aluno);
  });
});

describe('role helpers', () => {
  it('valida papéis conhecidos e resolve fallback', () => {
    expect(isValidRole('aluno')).toBe(true);
    expect(isValidRole('guest')).toBe(false);
    expect(resolveDemoRole({ simulatedRole: 'admin', user: null })).toBe('admin');
    expect(
      resolveDemoRole({
        simulatedRole: 'aluno',
        user: cloneDemoUserByRole('professor'),
      })
    ).toBe('aluno');
  });
});
