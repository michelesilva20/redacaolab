import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'agora';
  if (diffMins < 60) return `há ${diffMins} min`;
  if (diffHours < 24) return `há ${diffHours}h`;
  if (diffDays < 7) return `há ${diffDays}d`;
  return formatDate(date);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    enem: 'ENEM',
    unesp: 'UNESP',
    concursos: 'Concursos',
  };
  return labels[category] || category;
}

export function getLevelLabel(level: string): string {
  const labels: Record<string, string> = {
    iniciante: 'Iniciante',
    intermediario: 'Intermediário',
    avancado: 'Avançado',
    facil: 'Fácil',
    medio: 'Médio',
    dificil: 'Difícil',
  };
  return labels[level] || level;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    rascunho: 'Rascunho',
    enviada: 'Enviada',
    em_correcao: 'Em correção',
    corrigida: 'Corrigida',
  };
  return labels[status] || status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    rascunho: 'bg-neutral-100 text-neutral-600',
    enviada: 'bg-highlight-100 text-highlight-700',
    em_correcao: 'bg-secondary-100 text-secondary-700',
    corrigida: 'bg-success-100 text-success-700',
  };
  return colors[status] || 'bg-neutral-100 text-neutral-600';
}
