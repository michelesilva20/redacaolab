import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, FileText, Image, Clock, Edit } from 'lucide-react';
import { fakeApi } from '../../services/fakeApi';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { formatDate, getStatusLabel, getStatusColor, getCategoryLabel } from '../../lib/utils';

export function EssayDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: essay, isLoading } = useQuery({
    queryKey: ['essay', id],
    queryFn: () => fakeApi.essays.getById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton height={400} className="rounded-2xl" />
      </div>
    );
  }

  if (!essay) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-neutral-800">Redação não encontrada</h2>
        <Link to="/app/redacoes" className="text-primary-600 mt-2 inline-block">
          Voltar
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <Link to="/app/redacoes" className="inline-flex items-center gap-2 text-neutral-600 hover:text-primary-600 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>

      {/* Header */}
      <Card>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
              {essay.type === 'imagem' ? (
                <Image className="w-6 h-6 text-primary-600" />
              ) : (
                <FileText className="w-6 h-6 text-primary-600" />
              )}
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-neutral-800 mb-2">
                {essay.theme?.title || 'Tema não definido'}
              </h1>
              <div className="flex items-center gap-3">
                <Badge variant="primary">{getCategoryLabel(essay.category)}</Badge>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(essay.status)}`}>
                  {getStatusLabel(essay.status)}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right text-sm text-neutral-500">
            <div className="flex items-center gap-1 justify-end">
              <Clock className="w-4 h-4" />
              {formatDate(essay.createdAt)}
            </div>
            {essay.wordCount > 0 && (
              <p className="mt-1">{essay.wordCount} palavras</p>
            )}
          </div>
        </div>
      </Card>

      {/* Content */}
      <Card>
        <h3 className="font-semibold text-neutral-800 mb-4">Redação</h3>
        {essay.type === 'texto' ? (
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: essay.content || '' }}
          />
        ) : (
          <img
            src={essay.imageUrl}
            alt="Redação"
            className="w-full rounded-xl"
          />
        )}
      </Card>

      {/* Notes */}
      {essay.notes && (
        <Card>
          <h3 className="font-semibold text-neutral-800 mb-2">Observações</h3>
          <p className="text-neutral-600">{essay.notes}</p>
        </Card>
      )}

      {/* Actions */}
      {essay.status === 'rascunho' && (
        <div className="flex justify-end">
          <Button variant="gradient" rightIcon={<Edit className="w-4 h-4" />}>
            Continuar editando
          </Button>
        </div>
      )}

      {essay.status === 'corrigida' && (
        <div className="flex justify-end">
          <Link to={`/app/feedback/${essay.id}`}>
            <Button variant="gradient">
              Ver correção
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
