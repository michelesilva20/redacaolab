import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Play,
  Clock,
  Download,
  CheckSquare,
  Check,
  Zap,
  BookOpen,
} from 'lucide-react';
import { fakeApi } from '../../services/fakeApi';
import { useAuthStore } from '../../stores/authStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { getCategoryLabel, getLevelLabel } from '../../lib/utils';

export function LessonDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();

  const { data: lesson, isLoading } = useQuery({
    queryKey: ['lesson', id],
    queryFn: () => fakeApi.lessons.getById(id!),
    enabled: !!id,
  });

  const isCompleted = lesson && user?.id && lesson.completedBy.includes(user.id);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton height={400} className="rounded-2xl" />
        <Skeleton height={200} />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-neutral-800">Aula não encontrada</h2>
        <Link to="/app/aulas" className="text-primary-600 mt-2 inline-block">
          Voltar para aulas
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <Link to="/app/aulas" className="inline-flex items-center gap-2 text-neutral-600 hover:text-primary-600 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar para aulas
      </Link>

      {/* Video Player */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden bg-neutral-900 aspect-video"
      >
        <img
          src={lesson.thumbnail}
          alt={lesson.title}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <button className="w-20 h-20 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-xl transition-transform hover:scale-110">
            <Play className="w-8 h-8 text-primary-600 ml-1" />
          </button>
        </div>
        {isCompleted && (
          <div className="absolute top-4 right-4">
            <Badge variant="success" size="lg">
              <Check className="w-4 h-4 mr-1" />
              Concluída
            </Badge>
          </div>
        )}
      </motion.div>

      {/* Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="primary">{getCategoryLabel(lesson.category)}</Badge>
              <Badge variant="default">{getLevelLabel(lesson.level)}</Badge>
            </div>

            <h1 className="text-2xl font-display font-bold text-neutral-800 mb-4">
              {lesson.title}
            </h1>

            <p className="text-neutral-600 mb-6">{lesson.description}</p>

            <div className="flex items-center gap-6 text-sm text-neutral-500">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {lesson.duration} minutos
              </div>
              <div className="flex items-center gap-2 text-highlight-600">
                <Zap className="w-4 h-4" />
                +{lesson.xpReward} XP ao concluir
              </div>
            </div>
          </Card>

          {/* Checklist */}
          <Card>
            <h3 className="font-semibold text-neutral-800 mb-4 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-primary-600" />
              O que você vai aprender
            </h3>
            <ul className="space-y-3">
              {lesson.checklist.map((item, index) => (
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
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Materials */}
          <Card>
            <h3 className="font-semibold text-neutral-800 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary-600" />
              Materiais
            </h3>
            <div className="space-y-3">
              {lesson.materials.map((material) => (
                <a
                  key={material.id}
                  href={material.url}
                  className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                    <Download className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-800 truncate">
                      {material.name}
                    </p>
                    <p className="text-xs text-neutral-500 uppercase">{material.type}</p>
                  </div>
                </a>
              ))}
            </div>
          </Card>

          {/* Action */}
          <Card className="bg-gradient-hero text-white">
            <h3 className="font-semibold mb-2">Pronto para praticar?</h3>
            <p className="text-white/80 text-sm mb-4">
              Após assistir, aplique o que aprendeu escrevendo uma redação.
            </p>
            <Link to="/app/redacoes/nova">
              <Button className="w-full bg-white text-primary-600 hover:bg-neutral-100">
                Escrever redação
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
