import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { SAFE_FALLBACK_PATH } from '../lib/permissions';
import { Button } from './ui/Button';

interface ForbiddenPageProps {
  title?: string;
  description?: string;
}

export function ForbiddenPage({
  title = 'Acesso não permitido',
  description = 'Este perfil de demonstração não pode abrir esta página. O controle real de permissões ficará no servidor.',
}: ForbiddenPageProps) {
  return (
    <div className="max-w-lg mx-auto py-16 text-center" role="alert" aria-live="polite">
      <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-danger-50 text-danger-600 flex items-center justify-center">
        <ShieldAlert className="w-7 h-7" aria-hidden="true" />
      </div>
      <p className="text-sm font-medium text-danger-600 mb-2">403</p>
      <h1 className="text-2xl font-display font-bold text-neutral-800 mb-3">{title}</h1>
      <p className="text-neutral-500 mb-8">{description}</p>
      <Link to={SAFE_FALLBACK_PATH}>
        <Button variant="gradient">Voltar ao dashboard</Button>
      </Link>
    </div>
  );
}
