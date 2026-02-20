import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { GraduationCap, Users, Plus, MoreVertical } from 'lucide-react';
import { fakeApi } from '../../services/fakeApi';
import { useAuthStore } from '../../stores/authStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatDate } from '../../lib/utils';

export function Classes() {
  const { user, simulatedRole } = useAuthStore();
  const isAdmin = simulatedRole === 'admin';

  const { data: classes, isLoading } = useQuery({
    queryKey: ['classes', simulatedRole, user?.id],
    queryFn: () => isAdmin 
      ? fakeApi.classes.getAll()
      : fakeApi.classes.getByProfessor(user?.id || ''),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-display font-bold text-neutral-800">Turmas</h1>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
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
          <h1 className="text-2xl font-display font-bold text-neutral-800">Turmas</h1>
          <p className="text-neutral-500">
            {isAdmin ? 'Gerencie todas as turmas' : 'Suas turmas atribuídas'}
          </p>
        </div>
        <Button variant="gradient" leftIcon={<Plus className="w-4 h-4" />}>
          Nova turma
        </Button>
      </div>

      {/* Classes Grid */}
      {classes?.length === 0 ? (
        <EmptyState
          title="Nenhuma turma encontrada"
          description="Crie uma turma para começar"
          action={{
            label: 'Criar turma',
            onClick: () => {},
          }}
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes?.map((classItem, index) => (
            <motion.div
              key={classItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover className="h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-primary-600" />
                  </div>
                  <button className="p-2 hover:bg-neutral-100 rounded-lg">
                    <MoreVertical className="w-4 h-4 text-neutral-500" />
                  </button>
                </div>

                <h3 className="font-semibold text-neutral-800 mb-2">
                  {classItem.name}
                </h3>
                <p className="text-sm text-neutral-500 mb-4 line-clamp-2">
                  {classItem.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-neutral-500 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    {classItem.studentIds.length} alunos
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-xs text-neutral-400">
                    Criada em {formatDate(classItem.createdAt)}
                  </span>
                  <Badge variant="primary" size="sm">Ativa</Badge>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
