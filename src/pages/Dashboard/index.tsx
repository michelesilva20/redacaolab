import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PenTool,
  BookOpen,
  TrendingUp,
  Zap,
  Flame,
  Target,
  ArrowRight,
  Play,
  FileText,
  Clock,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { useAuthStore } from '../../stores/authStore';
import { fakeApi } from '../../services/fakeApi';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar, CircularProgress } from '../../components/ui/ProgressBar';
import { DashboardSkeleton } from '../../components/ui/Skeleton';
import { MissionCard } from '../../components/gamification/MissionCard';
import { BadgeCard } from '../../components/gamification/BadgeCard';
import { formatRelativeTime, getCategoryLabel } from '../../lib/utils';

export function Dashboard() {
  const { user, simulatedRole } = useAuthStore();
  const userId = user?.id || 'user-aluno-1';

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', simulatedRole, userId],
    queryFn: () => fakeApi.dashboard.getData(simulatedRole, userId),
  });

  if (isLoading || !data) {
    return <DashboardSkeleton />;
  }

  const { stats, gamification, recommendedLesson, featuredTheme, weeklyProgress, competencyScores } = data;

  const radarData = competencyScores.map((c) => ({
    competency: c.competency,
    score: c.score,
    fullMark: 200,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-800">
            Olá, {user?.name?.split(' ')[0] || 'Estudante'}! 👋
          </h1>
          <p className="text-neutral-500">
            Continue sua jornada rumo à nota 1000
          </p>
        </div>
        <Link to="/app/redacoes/nova">
          <Button variant="gradient" rightIcon={<PenTool className="w-4 h-4" />}>
            Escrever nova redação
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary-100 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-600" />
                </div>
                <span className="text-sm text-neutral-500">Redações</span>
              </div>
              <p className="text-3xl font-bold text-neutral-800">{stats.essaysSubmitted}</p>
              <p className="text-sm text-success-600 mt-1">+2 esta semana</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-secondary-100 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-secondary-600" />
                </div>
                <span className="text-sm text-neutral-500">Média</span>
              </div>
              <p className="text-3xl font-bold text-neutral-800">{stats.averageScore}</p>
              <p className="text-sm text-success-600 mt-1">↑ 40 pts vs anterior</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-highlight-100 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-highlight-100 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-highlight-600" />
                </div>
                <span className="text-sm text-neutral-500">XP Semanal</span>
              </div>
              <p className="text-3xl font-bold text-neutral-800">{gamification.weeklyXp}</p>
              <ProgressBar
                value={gamification.weeklyXp}
                max={gamification.weeklyGoal}
                size="sm"
                variant="gradient"
                className="mt-2"
              />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-accent-100 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center">
                  <Flame className="w-5 h-5 text-accent-600" />
                </div>
                <span className="text-sm text-neutral-500">Streak</span>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-neutral-800">{stats.streak}</p>
                <span className="text-neutral-500">dias</span>
              </div>
              <p className="text-sm text-accent-600 mt-1">🔥 Continue assim!</p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Progress Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução Semanal</CardTitle>
            </CardHeader>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} domain={[0, 1000]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#7c3aed"
                    strokeWidth={3}
                    dot={{ fill: '#7c3aed', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Theme and Lesson Row */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Featured Theme */}
            {featuredTheme && (
              <Card hover className="group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Badge variant="primary" size="sm" className="mb-2">
                      Tema do dia
                    </Badge>
                    <h3 className="font-semibold text-neutral-800 mb-1 line-clamp-2">
                      {featuredTheme.title}
                    </h3>
                    <p className="text-sm text-neutral-500 mb-3">
                      {getCategoryLabel(featuredTheme.category)} • {featuredTheme.axis}
                    </p>
                    <Link to={`/app/temas/${featuredTheme.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                        className="group-hover:text-primary-600"
                      >
                        Ver tema
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            )}

            {/* Recommended Lesson */}
            {recommendedLesson && (
              <Card hover className="group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-secondary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Badge variant="secondary" size="sm" className="mb-2">
                      Aula recomendada
                    </Badge>
                    <h3 className="font-semibold text-neutral-800 mb-1 line-clamp-2">
                      {recommendedLesson.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-neutral-500 mb-3">
                      <Clock className="w-4 h-4" />
                      {recommendedLesson.duration} min
                    </div>
                    <Link to={`/app/aulas/${recommendedLesson.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        rightIcon={<Play className="w-4 h-4" />}
                        className="group-hover:text-secondary-600"
                      >
                        Assistir
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Right Column - Gamification */}
        <div className="space-y-6">
          {/* Competency Radar */}
          <Card>
            <CardHeader>
              <CardTitle>Competências ENEM</CardTitle>
            </CardHeader>
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

          {/* Daily Missions */}
          <Card>
            <CardHeader>
              <CardTitle>Missões do dia</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {gamification.missions.filter((m) => m.type === 'daily').slice(0, 3).map((mission) => (
                <MissionCard key={mission.id} mission={mission} />
              ))}
            </div>
          </Card>

          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle>Conquistas recentes</CardTitle>
            </CardHeader>
            <div className="flex gap-4 justify-center">
              {gamification.badges.slice(0, 3).map((badge) => (
                <BadgeCard key={badge.id} badge={badge} size="sm" showDetails={false} />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
