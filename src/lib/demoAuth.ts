import { getUserByRole } from '../mocks/users';
import type { Role, User } from '../types';

export const AUTH_STORAGE_KEY = 'redacaolab-auth';

export const DEMO_ROLES: Role[] = ['aluno', 'professor', 'admin'];

export function isValidRole(role: unknown): role is Role {
  return role === 'aluno' || role === 'professor' || role === 'admin';
}

export function isValidAuthSession(
  isAuthenticated: boolean,
  user: User | null | undefined
): boolean {
  return isAuthenticated === true && user != null && typeof user.id === 'string' && user.id.length > 0;
}

export function cloneDemoUserByRole(role: Role): User {
  return structuredClone(getUserByRole(role));
}

export interface PersistableAuth {
  user: User | null;
  isAuthenticated: boolean;
  isSimulatedMode: boolean;
  simulatedRole: Role;
}

export function resolveDemoRole(state: Pick<PersistableAuth, 'user' | 'simulatedRole'>): Role {
  if (isValidRole(state.simulatedRole)) {
    return state.simulatedRole;
  }
  if (state.user && isValidRole(state.user.role)) {
    return state.user.role;
  }
  return 'aluno';
}

export function isConsistentDemoIdentity(user: User, role: Role): boolean {
  const expected = getUserByRole(role);
  return user.id === expected.id && user.role === role && expected.role === role;
}

export function repairAuthState(state: PersistableAuth): PersistableAuth {
  const simulatedMode = state.isSimulatedMode !== false;
  const role = resolveDemoRole(state);

  if (!isValidAuthSession(state.isAuthenticated, state.user)) {
    return {
      user: null,
      isAuthenticated: false,
      isSimulatedMode: simulatedMode,
      simulatedRole: role,
    };
  }

  const user = state.user as User;
  const nextUser = isConsistentDemoIdentity(user, role)
    ? structuredClone(user)
    : cloneDemoUserByRole(role);

  return {
    user: nextUser,
    isAuthenticated: true,
    isSimulatedMode: simulatedMode,
    simulatedRole: role,
  };
}
