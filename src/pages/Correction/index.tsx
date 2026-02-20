import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Send,
  MessageSquare,
  Plus,
  FileText,
  Image,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { fakeApi } from '../../services/fakeApi';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { getCategoryLabel } from '../../lib/utils';
import type { Competency } from '../../types';

const competencies: Omit<Competency, 'score' | 'feedback'>[] = [
  { id: 'C1', name: 'Domínio da norma culta', maxScore: 200 },
  { id: 'C2', name: 'Compreensão do tema', maxScore: 200 },
  { id: 'C3', name: 'Argumentação', maxScore: 200 },
  { id: 'C4', name: 'Coesão textual', maxScore: 200 },
  { id: 'C5', name: 'Proposta de intervenção', maxScore: 200 },
];

const categoryColors: Record<string, string> = {
  gramatica: 'bg-danger-100 text-danger-700 border-danger-300',
  coesao: 'bg-secondary-100 text-secondary-700 border-secondary-300',
  repertorio: 'bg-highlight-100 text-highlight-700 border-highlight-300',
  intervencao: 'bg-primary-100 text-primary-700 border-primary-300',
};

export function Correction() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addToast } = useUIStore();

  const [scores, setScores] = useState<Record<string, number>>({
    C1: 160,
    C2: 160,
    C3: 160,
    C4: 160,
    C5: 160,
  });
  const [feedbacks, setFeedbacks] = useState<Record<string, string>>({});
  const [generalFeedback, setGeneralFeedback] = useState('');
  const [strengths, setStrengths] = useState<string[]>(['']);
  const [improvements, setImprovements] = useState<string[]>(['']);
  const [zoom, setZoom] = useState(1);

  const { data: essay, isLoading } = useQuery({
    queryKey: ['essay', id],
    queryFn: () => fakeApi.essays.getById(id!),
    enabled: !!id,
  });

  const submitMutation = useMutation({
    mutationFn: async (status: 'rascunho' | 'finalizada') => {
      const correction = {
        professorId: user?.id,
        competencies: competencies.map((c) => ({
          ...c,
          score: scores[c.id],
          feedback: feedbacks[c.id] || '',
        })),
        totalScore: Object.values(scores).reduce((a, b) => a + b, 0),
        generalFeedback,
        strengths: strengths.filter((s) => s.trim()),
        improvements: improvements.filter((i) => i.trim()),
        comments: [],
        highlights: [],
        status,
      };
      return fakeApi.corrections.submit(id!, correction);
    },
    onSuccess: (_, status) => {
      addToast({
        title: status === 'finalizada' ? 'Correção enviada!' : 'Rascunho salvo',
        type: 'success',
      });
      if (status === 'finalizada') {
        navigate('/app/redacoes');
      }
    },
  });

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton height={600} className="rounded-2xl" />
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
    <div className="space-y-6">
      {/* Back button */}
      <Link to="/app/redacoes" className="inline-flex items-center gap-2 text-neutral-600 hover:text-primary-600 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-800">Correção</h1>
          <p className="text-neutral-500">{essay.theme?.title}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="primary">{getCategoryLabel(essay.category)}</Badge>
          <div className="text-right">
            <p className="text-sm text-neutral-500">Nota total</p>
            <p className="text-2xl font-bold text-primary-600">{totalScore}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left - Essay */}
        <div className="space-y-4">
          <Card padding="sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-neutral-800 flex items-center gap-2">
                {essay.type === 'imagem' ? (
                  <>
                    <Image className="w-5 h-5 text-primary-600" />
                    Imagem da redação
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5 text-primary-600" />
                    Texto da redação
                  </>
                )}
              </h3>
              {essay.type === 'imagem' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                    className="p-2 hover:bg-neutral-100 rounded-lg"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-neutral-500">{Math.round(zoom * 100)}%</span>
                  <button
                    onClick={() => setZoom(Math.min(2, zoom + 0.25))}
                    className="p-2 hover:bg-neutral-100 rounded-lg"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="max-h-[600px] overflow-auto rounded-xl border border-neutral-200">
              {essay.type === 'texto' ? (
                <div 
                  className="prose prose-sm max-w-none p-4"
                  dangerouslySetInnerHTML={{ __html: essay.content || '' }}
                />
              ) : (
                <img
                  src={essay.imageUrl}
                  alt="Redação"
                  style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
                  className="transition-transform"
                />
              )}
            </div>
          </Card>

          {/* Comment categories legend */}
          <Card padding="sm">
            <h4 className="text-sm font-medium text-neutral-700 mb-3">Categorias de marcação</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(categoryColors).map(([cat, color]) => (
                <span key={cat} className={`px-3 py-1 rounded-full text-xs font-medium border ${color}`}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </span>
              ))}
            </div>
          </Card>
        </div>

        {/* Right - Rubric */}
        <div className="space-y-4">
          {/* Competencies */}
          <Card>
            <h3 className="font-semibold text-neutral-800 mb-4">Rubrica ENEM</h3>
            <div className="space-y-4">
              {competencies.map((comp) => (
                <motion.div
                  key={comp.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-neutral-50 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-neutral-800">
                      {comp.id}: {comp.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        max={200}
                        step={20}
                        value={scores[comp.id]}
                        onChange={(e) => setScores({ ...scores, [comp.id]: Number(e.target.value) })}
                        className="w-20 px-3 py-1.5 rounded-lg border border-neutral-200 text-center font-semibold"
                      />
                      <span className="text-neutral-500">/ 200</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={200}
                    step={20}
                    value={scores[comp.id]}
                    onChange={(e) => setScores({ ...scores, [comp.id]: Number(e.target.value) })}
                    className="w-full accent-primary-600"
                  />
                  <textarea
                    placeholder={`Feedback para ${comp.name}...`}
                    value={feedbacks[comp.id] || ''}
                    onChange={(e) => setFeedbacks({ ...feedbacks, [comp.id]: e.target.value })}
                    className="w-full mt-2 px-3 py-2 rounded-lg border border-neutral-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={2}
                  />
                </motion.div>
              ))}
            </div>
          </Card>

          {/* General Feedback */}
          <Card>
            <h3 className="font-semibold text-neutral-800 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary-600" />
              Feedback geral
            </h3>
            <Textarea
              placeholder="Escreva um feedback geral sobre a redação..."
              value={generalFeedback}
              onChange={(e) => setGeneralFeedback(e.target.value)}
              rows={4}
            />
          </Card>

          {/* Strengths & Improvements */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <h4 className="font-medium text-success-700 mb-3">Pontos fortes</h4>
              {strengths.map((s, i) => (
                <input
                  key={i}
                  type="text"
                  value={s}
                  onChange={(e) => {
                    const newStrengths = [...strengths];
                    newStrengths[i] = e.target.value;
                    setStrengths(newStrengths);
                  }}
                  placeholder="Adicionar ponto forte..."
                  className="w-full px-3 py-2 mb-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-success-500"
                />
              ))}
              <button
                onClick={() => setStrengths([...strengths, ''])}
                className="text-sm text-success-600 hover:text-success-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Adicionar
              </button>
            </Card>

            <Card>
              <h4 className="font-medium text-highlight-700 mb-3">Pontos de melhoria</h4>
              {improvements.map((imp, i) => (
                <input
                  key={i}
                  type="text"
                  value={imp}
                  onChange={(e) => {
                    const newImp = [...improvements];
                    newImp[i] = e.target.value;
                    setImprovements(newImp);
                  }}
                  placeholder="Adicionar ponto de melhoria..."
                  className="w-full px-3 py-2 mb-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-highlight-500"
                />
              ))}
              <button
                onClick={() => setImprovements([...improvements, ''])}
                className="text-sm text-highlight-600 hover:text-highlight-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Adicionar
              </button>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="ghost"
              leftIcon={<Save className="w-4 h-4" />}
              onClick={() => submitMutation.mutate('rascunho')}
              isLoading={submitMutation.isPending}
            >
              Salvar rascunho
            </Button>
            <Button
              variant="gradient"
              rightIcon={<Send className="w-4 h-4" />}
              onClick={() => submitMutation.mutate('finalizada')}
              isLoading={submitMutation.isPending}
            >
              Finalizar correção
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
