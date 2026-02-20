import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  FileText,
  Image,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  Star,
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import { fakeApi } from '../../services/fakeApi';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Skeleton } from '../../components/ui/Skeleton';
import { getCategoryLabel, formatDate } from '../../lib/utils';

export function Feedback() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: essay, isLoading } = useQuery({
    queryKey: ['essay', id],
    queryFn: () => fakeApi.essays.getById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton height={600} className="rounded-2xl" />
      </div>
    );
  }

  if (!essay || !essay.correction) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-neutral-800">Correção não encontrada</h2>
        <Link to="/app/redacoes" className="text-primary-600 mt-2 inline-block">
          Voltar
        </Link>
      </div>
    );
  }

  const { correction } = essay;
  const radarData = correction.competencies.map((c) => ({
    competency: c.id,
    score: c.score,
    fullMark: 200,
  }));

  const getScoreColor = (score: number) => {
    if (score >= 900) return 'text-success-600';
    if (score >= 700) return 'text-secondary-600';
    if (score >= 500) return 'text-highlight-600';
    return 'text-danger-600';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 900) return { label: 'Excelente!', icon: Star };
    if (score >= 700) return { label: 'Muito bom!', icon: TrendingUp };
    if (score >= 500) return { label: 'Bom, continue evoluindo!', icon: TrendingUp };
    return { label: 'Você pode melhorar!', icon: AlertTriangle };
  };

  const grade = getScoreGrade(correction.totalScore);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Back button */}
      <Link to="/app/redacoes" className="inline-flex items-center gap-2 text-neutral-600 hover:text-primary-600 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-hero text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <Badge className="bg-white/20 text-white border-0 mb-3">
                {getCategoryLabel(essay.category)}
              </Badge>
              <h1 className="text-2xl font-display font-bold mb-2">
                {essay.theme?.title}
              </h1>
              <p className="text-white/70">
                Corrigida em {formatDate(correction.finishedAt || correction.createdAt)}
              </p>
            </div>
            <div className="text-center md:text-right">
              <div className={`text-5xl font-bold mb-2 ${getScoreColor(correction.totalScore).replace('text-', 'text-white')}`}>
                {correction.totalScore}
              </div>
              <div className="flex items-center gap-2 justify-center md:justify-end text-white/90">
                <grade.icon className="w-5 h-5" />
                <span>{grade.label}</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left - Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Competencies Breakdown */}
          <Card>
            <h3 className="font-semibold text-neutral-800 mb-6">Nota por competência</h3>
            <div className="space-y-6">
              {correction.competencies.map((comp, index) => (
                <motion.div
                  key={comp.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium text-neutral-800">{comp.id}: {comp.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${getScoreColor(comp.score * 5)}`}>
                        {comp.score}
                      </span>
                      <span className="text-neutral-400">/ {comp.maxScore}</span>
                    </div>
                  </div>
                  <ProgressBar
                    value={comp.score}
                    max={comp.maxScore}
                    size="md"
                    variant={comp.score >= 160 ? 'success' : comp.score >= 120 ? 'primary' : 'gradient'}
                  />
                  {comp.feedback && (
                    <p className="text-sm text-neutral-500 mt-2 italic">
                      {comp.feedback}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </Card>

          {/* General Feedback */}
          <Card>
            <h3 className="font-semibold text-neutral-800 mb-4">Feedback do professor</h3>
            <p className="text-neutral-600 whitespace-pre-line">
              {correction.generalFeedback}
            </p>
          </Card>

          {/* Strengths & Improvements */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-success-50 border border-success-200">
              <h4 className="font-medium text-success-800 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Pontos fortes
              </h4>
              <ul className="space-y-2">
                {correction.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-success-700">
                    <span className="mt-1">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="bg-highlight-50 border border-highlight-200">
              <h4 className="font-medium text-highlight-800 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Pontos de melhoria
              </h4>
              <ul className="space-y-2">
                {correction.improvements.map((imp, i) => (
                  <li key={i} className="flex items-start gap-2 text-highlight-700">
                    <span className="mt-1">•</span>
                    {imp}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Original Essay */}
          <Card>
            <h3 className="font-semibold text-neutral-800 mb-4 flex items-center gap-2">
              {essay.type === 'imagem' ? (
                <Image className="w-5 h-5 text-primary-600" />
              ) : (
                <FileText className="w-5 h-5 text-primary-600" />
              )}
              Sua redação
            </h3>
            {essay.type === 'texto' ? (
              <div 
                className="prose prose-sm max-w-none p-4 bg-neutral-50 rounded-xl"
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
        </div>

        {/* Right - Stats */}
        <div className="space-y-6">
          {/* Radar Chart */}
          <Card>
            <h3 className="font-semibold text-neutral-800 mb-4">Visão geral</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="competency" fontSize={12} stroke="#64748b" />
                  <PolarRadiusAxis angle={30} domain={[0, 200]} fontSize={10} stroke="#94a3b8" />
                  <Radar
                    name="Nota"
                    dataKey="score"
                    stroke="#7c3aed"
                    fill="#7c3aed"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Actions */}
          <Card className="bg-gradient-cta text-white">
            <h3 className="font-semibold mb-2">Quer melhorar?</h3>
            <p className="text-white/80 text-sm mb-4">
              Refaça essa redação aplicando os feedbacks recebidos.
            </p>
            <Button
              onClick={() => navigate('/app/redacoes/nova', { state: { themeId: essay.themeId } })}
              className="w-full bg-white text-primary-600 hover:bg-neutral-100"
              rightIcon={<RefreshCw className="w-4 h-4" />}
            >
              Refazer com base no feedback
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
