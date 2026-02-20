import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Play, Filter, Search, CheckCircle } from 'lucide-react';
import { fakeApi } from '../../services/fakeApi';
import { useAuthStore } from '../../stores/authStore';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { getCategoryLabel, getLevelLabel } from '../../lib/utils';
import type { Lesson } from '../../types';

const categoryOptions = [
  { value: 'all', label: 'Todas' },
  { value: 'enem', label: 'ENEM' },
  { value: 'unesp', label: 'UNESP' },
  { value: 'concursos', label: 'Concursos' },
];

const levelOptions = [
  { value: 'all', label: 'Todos os níveis' },
  { value: 'iniciante', label: 'Iniciante' },
  { value: 'intermediario', label: 'Intermediário' },
  { value: 'avancado', label: 'Avançado' },
];

export function Lessons() {
  const { user } = useAuthStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [level, setLevel] = useState('all');

  const { data: lessons, isLoading } = useQuery({
    queryKey: ['lessons', category],
    queryFn: () => fakeApi.lessons.getAll(category === 'all' ? undefined : category),
  });

  const filteredLessons = lessons?.filter((lesson) => {
    const matchesSearch = lesson.title.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = level === 'all' || lesson.level === level;
    return matchesSearch && matchesLevel;
  });

  const isCompleted = (lesson: Lesson) => 
    user?.id && lesson.completedBy.includes(user.id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-display font-bold text-neutral-800">Aulas</h1>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-800">Aulas</h1>
          <p className="text-neutral-500">
            Aprenda técnicas de redação com nossos especialistas
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card padding="sm" className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar aulas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-5 h-5" />}
          />
        </div>
        <div className="flex gap-3">
          <Select
            options={categoryOptions}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <Select
            options={levelOptions}
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          />
        </div>
      </Card>

      {/* Lessons Grid */}
      {filteredLessons?.length === 0 ? (
        <EmptyState
          title="Nenhuma aula encontrada"
          description="Tente ajustar os filtros ou busque por outro termo"
          variant="search"
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons?.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/app/aulas/${lesson.id}`}>
                <Card hover className="h-full group">
                  <div className="relative mb-4 rounded-xl overflow-hidden">
                    <img
                      src={lesson.thumbnail}
                      alt={lesson.title}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="w-6 h-6 text-primary-600 ml-1" />
                      </div>
                    </div>
                    {isCompleted(lesson) && (
                      <div className="absolute top-2 right-2">
                        <div className="w-8 h-8 rounded-full bg-success-500 flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="primary" size="sm">
                      {getCategoryLabel(lesson.category)}
                    </Badge>
                    <Badge variant="default" size="sm">
                      {getLevelLabel(lesson.level)}
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-neutral-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {lesson.title}
                  </h3>

                  <p className="text-sm text-neutral-500 line-clamp-2 mb-4">
                    {lesson.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-neutral-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {lesson.duration} min
                    </div>
                    <div className="flex items-center gap-1 text-highlight-600">
                      +{lesson.xpReward} XP
                    </div>
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
