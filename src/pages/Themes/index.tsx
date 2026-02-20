import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Search, Filter, Star, TrendingUp, PenTool } from 'lucide-react';
import { fakeApi } from '../../services/fakeApi';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { getCategoryLabel, getLevelLabel } from '../../lib/utils';

const categoryOptions = [
  { value: 'all', label: 'Todas as bancas' },
  { value: 'enem', label: 'ENEM' },
  { value: 'unesp', label: 'UNESP' },
  { value: 'concursos', label: 'Concursos' },
];

const difficultyOptions = [
  { value: 'all', label: 'Todas as dificuldades' },
  { value: 'facil', label: 'Fácil' },
  { value: 'medio', label: 'Médio' },
  { value: 'dificil', label: 'Difícil' },
];

const difficultyColors: Record<string, string> = {
  facil: 'bg-success-100 text-success-700',
  medio: 'bg-highlight-100 text-highlight-700',
  dificil: 'bg-danger-100 text-danger-700',
};

export function Themes() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');

  const { data: themes, isLoading } = useQuery({
    queryKey: ['themes', category],
    queryFn: () => fakeApi.themes.getAll(category === 'all' ? undefined : category),
  });

  const filteredThemes = themes?.filter((theme) => {
    const matchesSearch = theme.title.toLowerCase().includes(search.toLowerCase()) ||
                         theme.axis.toLowerCase().includes(search.toLowerCase());
    const matchesDifficulty = difficulty === 'all' || theme.difficulty === difficulty;
    return matchesSearch && matchesDifficulty;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-display font-bold text-neutral-800">Temas de Redação</h1>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
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
          <h1 className="text-2xl font-display font-bold text-neutral-800">Temas de Redação</h1>
          <p className="text-neutral-500">
            Escolha um tema e comece a praticar
          </p>
        </div>
        <Link to="/app/redacoes/nova">
          <Button variant="gradient" rightIcon={<PenTool className="w-4 h-4" />}>
            Escrever redação
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card padding="sm" className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar temas..."
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
            options={difficultyOptions}
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          />
        </div>
      </Card>

      {/* Themes Grid */}
      {filteredThemes?.length === 0 ? (
        <EmptyState
          title="Nenhum tema encontrado"
          description="Tente ajustar os filtros ou busque por outro termo"
          variant="search"
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredThemes?.map((theme, index) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/app/temas/${theme.id}`}>
                <Card hover className="h-full group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="primary" size="sm">
                          {getCategoryLabel(theme.category)}
                        </Badge>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColors[theme.difficulty]}`}>
                          {getLevelLabel(theme.difficulty)}
                        </span>
                        {theme.isFeatured && (
                          <Star className="w-4 h-4 text-highlight-500 fill-highlight-500" />
                        )}
                      </div>

                      <h3 className="font-semibold text-neutral-800 mb-2 group-hover:text-primary-600 transition-colors">
                        {theme.title}
                      </h3>

                      <p className="text-sm text-neutral-500 mb-3 line-clamp-2">
                        {theme.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-neutral-500">{theme.axis}</span>
                      </div>
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
