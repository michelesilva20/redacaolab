import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Target,
  Calendar,
  Edit2,
  Camera,
  Zap,
  Flame,
  Trophy,
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import { useAuthStore } from '../../stores/authStore';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar, CircularProgress } from '../../components/ui/ProgressBar';
import { BadgeCard } from '../../components/gamification/BadgeCard';
import { getXpProgress } from '../../mocks/gamification';
import { allBadges } from '../../mocks/gamification';
import { formatDate, getCategoryLabel } from '../../lib/utils';

const competencyData = [
  { competency: 'C1', score: 165, fullMark: 200 },
  { competency: 'C2', score: 180, fullMark: 200 },
  { competency: 'C3', score: 145, fullMark: 200 },
  { competency: 'C4', score: 160, fullMark: 200 },
  { competency: 'C5', score: 175, fullMark: 200 },
];

export function Profile() {
  const { user } = useAuthStore();
  const xpProgress = getXpProgress(user?.xp || 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-hero text-white overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <img
                src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                alt={user?.name}
                className="w-24 h-24 rounded-full border-4 border-white/30"
              />
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Camera className="w-4 h-4 text-primary-600" />
              </button>
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-2xl font-display font-bold">{user?.name}</h1>
              <p className="text-white/80">{user?.email}</p>
              <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                <Badge className="bg-white/20 text-white border-0">
                  {getCategoryLabel(user?.preferences.targetExam || 'enem')}
                </Badge>
                <Badge className="bg-white/20 text-white border-0">
                  Nível {user?.level || 1}
                </Badge>
              </div>
            </div>
            <Button className="bg-white/20 text-white hover:bg-white/30" leftIcon={<Edit2 className="w-4 h-4" />}>
              Editar perfil
            </Button>
          </div>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid sm:grid-cols-3 gap-4">
            <Card className="text-center">
              <div className="w-12 h-12 bg-highlight-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-highlight-600" />
              </div>
              <p className="text-2xl font-bold text-neutral-800">{user?.xp || 0}</p>
              <p className="text-sm text-neutral-500">XP Total</p>
            </Card>
            <Card className="text-center">
              <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Flame className="w-6 h-6 text-accent-600" />
              </div>
              <p className="text-2xl font-bold text-neutral-800">{user?.streak || 0}</p>
              <p className="text-sm text-neutral-500">Dias de streak</p>
            </Card>
            <Card className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-6 h-6 text-primary-600" />
              </div>
              <p className="text-2xl font-bold text-neutral-800">{user?.badges.length || 0}</p>
              <p className="text-sm text-neutral-500">Conquistas</p>
            </Card>
          </div>

          {/* Competency Radar */}
          <Card>
            <CardHeader>
              <CardTitle>Desempenho por competência</CardTitle>
            </CardHeader>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={competencyData}>
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

          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle>Todas as conquistas</CardTitle>
            </CardHeader>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
              {allBadges.map((badge) => {
                const unlocked = user?.badges.some((b) => b.id === badge.id);
                return (
                  <BadgeCard
                    key={badge.id}
                    badge={badge}
                    unlocked={unlocked}
                    size="sm"
                    showDetails={false}
                  />
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Level Progress */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-neutral-800">Nível {user?.level || 1}</h3>
              <span className="text-sm text-neutral-500">
                {xpProgress.current}/{xpProgress.needed} XP
              </span>
            </div>
            <ProgressBar
              value={xpProgress.current}
              max={xpProgress.needed}
              variant="gradient"
              size="lg"
            />
            <p className="text-sm text-neutral-500 mt-2 text-center">
              Faltam {xpProgress.needed - xpProgress.current} XP para o próximo nível
            </p>
          </Card>

          {/* Goals */}
          <Card>
            <CardHeader>
              <CardTitle>Metas</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-neutral-500">Meta de nota</p>
                  <p className="font-semibold text-neutral-800">
                    {user?.preferences.currentLevel} → {user?.preferences.targetScore}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-secondary-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-neutral-500">Redações por semana</p>
                  <p className="font-semibold text-neutral-800">
                    {user?.preferences.weeklyGoal} redações
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-neutral-400" />
                <span className="text-sm text-neutral-600">{user?.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-neutral-400" />
                <span className="text-sm text-neutral-600">{user?.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-neutral-400" />
                <span className="text-sm text-neutral-600">
                  Membro desde {formatDate(user?.createdAt || '')}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
