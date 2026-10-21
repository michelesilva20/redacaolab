import type { Role } from '../types';

export const ALL_ROLES: readonly Role[] = ['aluno', 'professor', 'admin'];

/**
 * Matriz única de permissões da demonstração.
 * Não constitui autorização de produção — o servidor deverá validar cada operação.
 */
export const PERMISSIONS = {
  dashboard: ALL_ROLES,
  lessons: ALL_ROLES,
  themes: ALL_ROLES,
  essays: ALL_ROLES,
  essayCreate: ['aluno'],
  essayDetail: ['aluno'],
  correction: ['professor'],
  feedback: ['aluno'],
  classes: ['professor', 'admin'],
  users: ['admin'],
  reports: ['professor', 'admin'],
  settings: ['admin'],
  help: ALL_ROLES,
  profile: ALL_ROLES,
} as const;

export type Permission = keyof typeof PERMISSIONS;

export type NavItemConfig = {
  label: string;
  href: string;
  permission: Permission;
};

export const NAV_ITEMS: readonly NavItemConfig[] = [
  { label: 'Dashboard', href: '/app', permission: 'dashboard' },
  { label: 'Aulas', href: '/app/aulas', permission: 'lessons' },
  { label: 'Temas', href: '/app/temas', permission: 'themes' },
  { label: 'Redações', href: '/app/redacoes', permission: 'essays' },
  { label: 'Turmas', href: '/app/turmas', permission: 'classes' },
  { label: 'Usuários', href: '/app/usuarios', permission: 'users' },
  { label: 'Relatórios', href: '/app/relatorios', permission: 'reports' },
  { label: 'Configurações', href: '/app/configuracoes', permission: 'settings' },
  { label: 'Ajuda', href: '/app/ajuda', permission: 'help' },
];

export const CORRECTABLE_STATUSES = ['enviada', 'em_correcao'] as const;

export const SAFE_FALLBACK_PATH = '/app';

export function hasPermission(role: Role | null | undefined, permission: Permission): boolean {
  if (!role) return false;
  return (PERMISSIONS[permission] as readonly Role[]).includes(role);
}

export function getNavItemsForRole(role: Role | null | undefined): NavItemConfig[] {
  return NAV_ITEMS.filter((item) => hasPermission(role, item.permission));
}

type RouteRule = {
  permission: Permission;
  match: (pathname: string) => boolean;
};

const ROUTE_RULES: RouteRule[] = [
  { permission: 'dashboard', match: (path) => path === '/app' || path === '/app/' },
  { permission: 'lessons', match: (path) => path.startsWith('/app/aulas') },
  { permission: 'themes', match: (path) => path.startsWith('/app/temas') },
  {
    permission: 'essayCreate',
    match: (path) => path === '/app/redacoes/nova' || path.startsWith('/app/redacoes/nova/'),
  },
  {
    permission: 'essayDetail',
    match: (path) => /^\/app\/redacoes\/(?!nova(?:\/|$))[^/]+/.test(path),
  },
  { permission: 'essays', match: (path) => path === '/app/redacoes' || path === '/app/redacoes/' },
  { permission: 'correction', match: (path) => path.startsWith('/app/correcao') },
  { permission: 'feedback', match: (path) => path.startsWith('/app/feedback') },
  { permission: 'classes', match: (path) => path.startsWith('/app/turmas') },
  { permission: 'users', match: (path) => path.startsWith('/app/usuarios') },
  { permission: 'reports', match: (path) => path.startsWith('/app/relatorios') },
  { permission: 'settings', match: (path) => path.startsWith('/app/configuracoes') },
  { permission: 'help', match: (path) => path.startsWith('/app/ajuda') },
  { permission: 'profile', match: (path) => path.startsWith('/app/perfil') },
];

export function getPermissionForPath(pathname: string): Permission | null {
  return ROUTE_RULES.find((rule) => rule.match(pathname))?.permission ?? null;
}

export function canAccessPath(role: Role | null | undefined, pathname: string): boolean {
  const permission = getPermissionForPath(pathname);
  if (!permission) {
    return !pathname.startsWith('/app');
  }
  return hasPermission(role, permission);
}

export function canViewOwnEssay(
  userId: string | null | undefined,
  essay: { userId: string } | null | undefined
): boolean {
  return Boolean(userId && essay && essay.userId === userId);
}

export function canViewFeedback(
  userId: string | null | undefined,
  essay: { userId: string; correction?: unknown } | null | undefined
): boolean {
  return canViewOwnEssay(userId, essay) && Boolean(essay?.correction);
}

export function canCorrectEssay(essay: { status: string } | null | undefined): boolean {
  return Boolean(essay && (CORRECTABLE_STATUSES as readonly string[]).includes(essay.status));
}
