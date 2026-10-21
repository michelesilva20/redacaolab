import { describe, expect, it } from 'vitest';
import type { Role } from '../types';
import {
  NAV_ITEMS,
  PERMISSIONS,
  canAccessPath,
  canCorrectEssay,
  canEditDraft,
  canViewFeedback,
  canViewOwnEssay,
  getNavItemsForRole,
  getPermissionForPath,
  hasPermission,
} from './permissions';

const roles: Role[] = ['aluno', 'professor', 'admin'];

describe('matriz de permissões', () => {
  it.each([
    ['dashboard', ['aluno', 'professor', 'admin']],
    ['lessons', ['aluno', 'professor', 'admin']],
    ['themes', ['aluno', 'professor', 'admin']],
    ['essays', ['aluno', 'professor', 'admin']],
    ['essayCreate', ['aluno']],
    ['essayEdit', ['aluno']],
    ['essayDetail', ['aluno']],
    ['correction', ['professor']],
    ['feedback', ['aluno']],
    ['classes', ['professor', 'admin']],
    ['users', ['admin']],
    ['reports', ['professor', 'admin']],
    ['settings', ['admin']],
    ['help', ['aluno', 'professor', 'admin']],
    ['profile', ['aluno', 'professor', 'admin']],
  ] as const)('concede %s apenas a %s', (permission, allowed) => {
    for (const role of roles) {
      expect(hasPermission(role, permission)).toBe((allowed as readonly Role[]).includes(role));
    }
    expect(hasPermission(undefined, permission)).toBe(false);
  });
});

describe('rotas e sidebar usam a mesma matriz', () => {
  it('mapeia caminhos específicos antes dos genéricos', () => {
    expect(getPermissionForPath('/app')).toBe('dashboard');
    expect(getPermissionForPath('/app/redacoes')).toBe('essays');
    expect(getPermissionForPath('/app/redacoes/nova')).toBe('essayCreate');
    expect(getPermissionForPath('/app/redacoes/essay-5/editar')).toBe('essayEdit');
    expect(getPermissionForPath('/app/redacoes/essay-1')).toBe('essayDetail');
    expect(getPermissionForPath('/app/correcao/essay-2')).toBe('correction');
    expect(getPermissionForPath('/app/feedback/essay-1')).toBe('feedback');
    expect(getPermissionForPath('/app/usuarios')).toBe('users');
  });

  it('alinha cada item da Sidebar com canAccessPath', () => {
    for (const role of roles) {
      const hrefs = getNavItemsForRole(role).map((item) => item.href);
      for (const item of NAV_ITEMS) {
        expect(hrefs.includes(item.href)).toBe(canAccessPath(role, item.href));
        expect(hasPermission(role, item.permission)).toBe(canAccessPath(role, item.href));
      }
    }
  });

  it('não mostra administração para aluno nem usuários para professor', () => {
    const alunoHrefs = getNavItemsForRole('aluno').map((item) => item.href);
    const professorHrefs = getNavItemsForRole('professor').map((item) => item.href);

    expect(alunoHrefs).not.toContain('/app/turmas');
    expect(alunoHrefs).not.toContain('/app/usuarios');
    expect(alunoHrefs).not.toContain('/app/relatorios');
    expect(alunoHrefs).not.toContain('/app/configuracoes');
    expect(professorHrefs).not.toContain('/app/usuarios');
    expect(professorHrefs).not.toContain('/app/configuracoes');
    expect(professorHrefs).toContain('/app/turmas');
    expect(getNavItemsForRole('admin').map((item) => item.href)).toContain('/app/usuarios');
  });
});

describe('regras de recurso da demonstração', () => {
  it('bloqueia redação e feedback de outro aluno', () => {
    const own = { userId: 'user-aluno-1', correction: { id: 'c1' } };
    const other = { userId: 'user-aluno-2', correction: { id: 'c2' } };

    expect(canViewOwnEssay('user-aluno-1', own)).toBe(true);
    expect(canViewOwnEssay('user-aluno-1', other)).toBe(false);
    expect(canViewFeedback('user-aluno-1', own)).toBe(true);
    expect(canViewFeedback('user-aluno-1', other)).toBe(false);
    expect(canViewFeedback('user-aluno-1', { userId: 'user-aluno-1' })).toBe(false);
  });

  it('só permite editar rascunho textual do próprio aluno', () => {
    const draft = { userId: 'user-aluno-1', status: 'rascunho', type: 'texto' };

    expect(canEditDraft('user-aluno-1', draft)).toBe(true);
    expect(canEditDraft('user-aluno-2', draft)).toBe(false);
    expect(canEditDraft('user-aluno-1', { ...draft, status: 'enviada' })).toBe(false);
    expect(canEditDraft('user-aluno-1', { ...draft, type: 'imagem' })).toBe(false);
    expect(canAccessPath('professor', '/app/redacoes/essay-5/editar')).toBe(false);
    expect(canAccessPath('admin', '/app/redacoes/essay-5/editar')).toBe(false);
    expect(canAccessPath('aluno', '/app/redacoes/essay-5/editar')).toBe(true);
  });

  it('só permite corrigir redações enviadas ou em correção', () => {
    expect(canCorrectEssay({ status: 'enviada' })).toBe(true);
    expect(canCorrectEssay({ status: 'em_correcao' })).toBe(true);
    expect(canCorrectEssay({ status: 'rascunho' })).toBe(false);
    expect(canCorrectEssay({ status: 'corrigida' })).toBe(false);
    expect(canCorrectEssay(undefined)).toBe(false);
  });

  it('expõe a matriz completa para documentação', () => {
    expect(Object.keys(PERMISSIONS)).toContain('essayCreate');
  });
});
