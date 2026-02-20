import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  PenTool,
  BookOpen,
  CheckSquare,
  Check,
  Lightbulb,
  FileText,
} from 'lucide-react';
import { fakeApi } from '../../services/fakeApi';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { getCategoryLabel, getLevelLabel } from '../../lib/utils';

const difficultyColors: Record<string, string> = {
  facil: 'bg-success-100 text-success-700',
  medio: 'bg-highlight-100 text-highlight-700',
  dificil: 'bg-danger-100 text-danger-700',
};

export function ThemeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: theme, isLoading } = useQuery({
    queryKey: ['theme', id],
    queryFn: () => fakeApi.themes.getById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton height={200} className="rounded-2xl" />
        <Skeleton height={300} />
      </div>
    );
  }

  if (!theme) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-neutral-800">Tema não encontrado</h2>
        <Link to="/app/temas" className="text-primary-600 mt-2 inline-block">
          Voltar para temas
        </Link>
      </div>
    );
  }

  const handleStartWriting = () => {
    navigate('/app/redacoes/nova', { state: { themeId: theme.id } });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <Link to="/app/temas" className="inline-flex items-center gap-2 text-neutral-600 hover:text-primary-600 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar para temas
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-hero text-white">
          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-white/20 text-white border-0">
              {getCategoryLabel(theme.category)}
            </Badge>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[theme.difficulty]}`}>
              {getLevelLabel(theme.difficulty)}
            </span>
          </div>

          <h1 className="text-2xl font-display font-bold mb-4">
            {theme.title}
          </h1>

          <p className="text-white/80 mb-6">
            {theme.description}
          </p>

          <div className="flex items-center gap-4 text-sm text-white/70">
            <span>Eixo: {theme.axis}</span>
          </div>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Repertoire */}
          <Card>
            <h3 className="font-semibold text-neutral-800 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary-600" />
              Repertório sugerido
            </h3>
            <ul className="space-y-3">
              {theme.repertoire.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-primary-50 rounded-xl"
                >
                  <Lightbulb className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-700">{item}</span>
                </motion.li>
              ))}
            </ul>
          </Card>

          {/* Checklist */}
          <Card>
            <h3 className="font-semibold text-neutral-800 mb-4 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-success-600" />
              O que sua redação precisa ter
            </h3>
            <ul className="space-y-3">
              {theme.checklist.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-success-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-success-600" />
                  </div>
                  <span className="text-neutral-700">{item}</span>
                </motion.li>
              ))}
            </ul>
          </Card>

          {/* Examples */}
          {theme.examples.length > 0 && (
            <Card>
              <h3 className="font-semibold text-neutral-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-secondary-600" />
                Exemplos de recortes
              </h3>
              <div className="space-y-3">
                {theme.examples.map((example, index) => (
                  <p key={index} className="text-neutral-600 p-4 bg-neutral-50 rounded-xl italic">
                    "{example}"
                  </p>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* CTA */}
          <Card className="bg-gradient-cta text-white sticky top-24">
            <h3 className="font-semibold mb-2">Pronto para escrever?</h3>
            <p className="text-white/80 text-sm mb-4">
              Comece sua redação sobre este tema agora mesmo.
            </p>
            <Button
              onClick={handleStartWriting}
              className="w-full bg-white text-primary-600 hover:bg-neutral-100"
              rightIcon={<PenTool className="w-4 h-4" />}
            >
              Escrever agora
            </Button>
          </Card>

          {/* Tips */}
          <Card>
            <h3 className="font-semibold text-neutral-800 mb-4">Dicas importantes</h3>
            <ul className="space-y-3 text-sm text-neutral-600">
              <li className="flex items-start gap-2">
                <span className="text-primary-500">•</span>
                Leia atentamente todo o enunciado
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500">•</span>
                Identifique os recortes temáticos
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500">•</span>
                Use pelo menos 2 repertórios
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500">•</span>
                Não esqueça da proposta de intervenção
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
