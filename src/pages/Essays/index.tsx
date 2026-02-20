import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PenTool, FileText, Image, Clock, CheckCircle, Edit3 } from 'lucide-react';
import { fakeApi } from '../../services/fakeApi';
import { useAuthStore } from '../../stores/authStore';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatRelativeTime, getStatusLabel, getStatusColor, getCategoryLabel, truncate } from '../../lib/utils';
import type { Essay } from '../../types';

const statusIcons: Record<string, React.ReactNode> = {
  rascunho: <Edit3 className="w-4 h-4" />,
  enviada: <Clock className="w-4 h-4" />,
  em_correcao: <Edit3 className="w-4 h-4" />,
  corrigida: <CheckCircle className="w-4 h-4" />,
};

export function Essays() {
  const { user, simulatedRole } = useAuthStore();
  const userId = user?.id || 'user-aluno-1';
  const isProfessor = simulatedRole === 'professor';

  const { data: essays, isLoading } = useQuery({
    queryKey: ['essays', simulatedRole, userId],
    queryFn: () => isProfessor 
      ? fakeApi.essays.getForCorrection()
      : fakeApi.essays.getByUser(userId),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-display font-bold text-neutral-800">
            {isProfessor ? 'Redações para corrigir' : 'Minhas Redações'}
          </h1>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const getEssayLink = (essay: Essay) => {
    if (isProfessor) {
      return `/app/correcao/${essay.id}`;
    }
    if (essay.status === 'corrigida') {
      return `/app/feedback/${essay.id}`;
    }
    return `/app/redacoes/${essay.id}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-800">
            {isProfessor ? 'Redações para corrigir' : 'Minhas Redações'}
          </h1>
          <p className="text-neutral-500">
            {isProfessor 
              ? 'Gerencie as correções pendentes'
              : 'Acompanhe suas redações e correções'
            }
          </p>
        </div>
        {!isProfessor && (
          <Link to="/app/redacoes/nova">
            <Button variant="gradient" rightIcon={<PenTool className="w-4 h-4" />}>
              Nova redação
            </Button>
          </Link>
        )}
      </div>

      {/* Essays List */}
      {essays?.length === 0 ? (
        <EmptyState
          title={isProfessor ? 'Nenhuma redação pendente' : 'Nenhuma redação ainda'}
          description={isProfessor 
            ? 'Não há redações aguardando correção no momento'
            : 'Comece escrevendo sua primeira redação'
          }
          action={!isProfessor ? {
            label: 'Escrever redação',
            onClick: () => window.location.href = '/app/redacoes/nova',
          } : undefined}
        />
      ) : (
        <div className="space-y-4">
          {essays?.map((essay, index) => (
            <motion.div
              key={essay.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={getEssayLink(essay)}>
                <Card hover className="flex items-center gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                    {essay.type === 'imagem' ? (
                      <Image className="w-6 h-6 text-primary-600" />
                    ) : (
                      <FileText className="w-6 h-6 text-primary-600" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-neutral-800">
                        {essay.theme?.title || 'Tema não definido'}
                      </h3>
                      <Badge variant="primary" size="sm">
                        {getCategoryLabel(essay.category)}
                      </Badge>
                    </div>
                    
                    {essay.content && (
                      <p className="text-sm text-neutral-500 line-clamp-1 mb-2">
                        {truncate(essay.content, 100)}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-neutral-500">
                      <span>{formatRelativeTime(essay.createdAt)}</span>
                      {essay.wordCount > 0 && (
                        <span>{essay.wordCount} palavras</span>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(essay.status)}`}>
                      {statusIcons[essay.status]}
                      {getStatusLabel(essay.status)}
                    </span>
                    {essay.correction && (
                      <Badge variant="success" size="lg">
                        {essay.correction.totalScore}
                      </Badge>
                    )}
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
