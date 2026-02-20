import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  Download,
  Calendar,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';

const barData = [
  { name: 'Turma A', media: 780 },
  { name: 'Turma B', media: 820 },
  { name: 'Turma C', media: 750 },
  { name: 'Turma D', media: 860 },
];

const lineData = [
  { month: 'Jan', redacoes: 45, media: 720 },
  { month: 'Fev', redacoes: 52, media: 740 },
  { month: 'Mar', redacoes: 48, media: 760 },
  { month: 'Abr', redacoes: 70, media: 780 },
  { month: 'Mai', redacoes: 85, media: 800 },
  { month: 'Jun', redacoes: 92, media: 820 },
];

const pieData = [
  { name: 'C1', value: 165 },
  { name: 'C2', value: 178 },
  { name: 'C3', value: 152 },
  { name: 'C4', value: 168 },
  { name: 'C5', value: 175 },
];

const COLORS = ['#7c3aed', '#22d3ee', '#fb7185', '#f59e0b', '#22c55e'];

const periodOptions = [
  { value: 'week', label: 'Última semana' },
  { value: 'month', label: 'Último mês' },
  { value: 'quarter', label: 'Último trimestre' },
  { value: 'year', label: 'Último ano' },
];

export function Reports() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-800">Relatórios</h1>
          <p className="text-neutral-500">Acompanhe o desempenho geral da plataforma</p>
        </div>
        <div className="flex gap-3">
          <Select options={periodOptions} defaultValue="month" />
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Redações este mês</p>
                <p className="text-2xl font-bold text-neutral-800">248</p>
                <p className="text-sm text-success-600">+12% vs anterior</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-secondary-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Média geral</p>
                <p className="text-2xl font-bold text-neutral-800">782</p>
                <p className="text-sm text-success-600">+25 pts vs anterior</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-highlight-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-highlight-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Alunos ativos</p>
                <p className="text-2xl font-bold text-neutral-800">156</p>
                <p className="text-sm text-success-600">+8 novos</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-accent-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Correções pendentes</p>
                <p className="text-2xl font-bold text-neutral-800">12</p>
                <p className="text-sm text-neutral-500">Prazo: 72h</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Média por turma</CardTitle>
          </CardHeader>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} domain={[0, 1000]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                  }}
                />
                <Bar dataKey="media" fill="#7c3aed" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução mensal</CardTitle>
          </CardHeader>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis yAxisId="left" stroke="#64748b" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                  }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="redacoes"
                  stroke="#22d3ee"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="media"
                  stroke="#7c3aed"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Média por competência</CardTitle>
          </CardHeader>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 justify-center mt-4">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="text-sm text-neutral-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Top performers */}
        <Card>
          <CardHeader>
            <CardTitle>Top alunos do mês</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {[
              { name: 'Ana Clara', score: 920, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana' },
              { name: 'Pedro Lima', score: 880, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pedro' },
              { name: 'Maria Santos', score: 860, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria2' },
              { name: 'João Silva', score: 840, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao2' },
            ].map((student, index) => (
              <div key={student.name} className="flex items-center gap-4">
                <span className="w-6 text-center font-bold text-neutral-400">
                  {index + 1}
                </span>
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <p className="font-medium text-neutral-800">{student.name}</p>
                </div>
                <span className="font-bold text-primary-600">{student.score}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
