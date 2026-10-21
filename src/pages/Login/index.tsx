import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PenTool, CheckCircle, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../../components/ui/Button';
import type { Role } from '../../types';

const roles: { value: Role; label: string; description: string }[] = [
  { value: 'aluno', label: 'Aluno', description: 'Estudante vestibulando' },
  { value: 'professor', label: 'Professor', description: 'Corretor de redações' },
  { value: 'admin', label: 'Admin', description: 'Administrador' },
];

const benefits = [
  'Correção detalhada por competência',
  'Feedback linha a linha',
  'Acompanhamento de evolução',
  'Gamificação motivadora',
];

export function Login() {
  const navigate = useNavigate();
  const enterDemo = useAuthStore((state) => state.enterDemo);
  const [selectedRole, setSelectedRole] = useState<Role>('aluno');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedLabel = roles.find((role) => role.value === selectedRole)?.label ?? 'Aluno';

  const handleDemoLogin = () => {
    setIsLoading(true);
    setError('');
    try {
      enterDemo(selectedRole);
      navigate('/app');
    } catch {
      setError('Não foi possível entrar na demonstração. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-secondary-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl" />
          <svg className="absolute top-0 right-0 w-full h-full opacity-10" viewBox="0 0 800 800">
            <circle cx="600" cy="200" r="150" fill="none" stroke="white" strokeWidth="1" />
            <circle cx="200" cy="600" r="200" fill="none" stroke="white" strokeWidth="1" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 py-12">
          <Link to="/" className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <PenTool className="w-7 h-7 text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-white">
              Redação<span className="text-secondary-300">Lab</span>
            </span>
          </Link>

          <h1 className="text-4xl font-display font-bold text-white mb-4">
            Sua jornada para a nota 1000 começa aqui
          </h1>
          <p className="text-xl text-white/80 mb-10">
            Treine, escreva e evolua com correções que realmente ajudam.
          </p>

          <ul className="space-y-4 mb-10">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3 text-white/90">
                <div className="w-6 h-6 rounded-full bg-secondary-400 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                {benefit}
              </li>
            ))}
          </ul>

          <div className="relative h-40">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute top-0 left-0 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-highlight-400 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">XP da semana</p>
                  <p className="text-white/70 text-sm">+320 pontos</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
              className="absolute top-10 right-0 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Nota: 860</p>
                  <p className="text-white/70 text-sm">Correção pronta!</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-neutral-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-cta flex items-center justify-center">
              <PenTool className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-neutral-800">
              Redação<span className="text-primary-600">Lab</span>
            </span>
          </div>

          <div className="bg-white rounded-3xl shadow-card p-8">
            <div className="text-center mb-6">
              <p className="inline-flex items-center rounded-full bg-highlight-50 text-highlight-700 px-3 py-1 text-xs font-medium mb-3">
                Demonstração
              </p>
              <h2 className="text-2xl font-display font-bold text-neutral-800 mb-2">
                Explorar a demonstração
              </h2>
              <p className="text-neutral-500">
                Escolha um perfil fictício. Não há autenticação real e nenhuma senha é necessária.
              </p>
            </div>

            <div className="mb-6">
              <p className="block text-sm font-medium text-neutral-700 mb-2" id="demo-role-label">
                Perfil de demonstração
              </p>
              <div className="grid grid-cols-3 gap-2" role="group" aria-labelledby="demo-role-label">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setSelectedRole(role.value)}
                    aria-pressed={selectedRole === role.value}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      selectedRole === role.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <p className="font-medium text-sm text-neutral-800">{role.label}</p>
                    <p className="text-xs text-neutral-500">{role.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-sm text-danger-500 text-center mb-4" role="alert">
                {error}
              </p>
            )}

            <Button
              type="button"
              variant="gradient"
              className="w-full"
              size="lg"
              isLoading={isLoading}
              onClick={handleDemoLogin}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Entrar como {selectedLabel}
            </Button>

            <p className="text-center text-sm text-neutral-500 mt-6">
              Os dados desta demonstração são fictícios e ficam só neste navegador.{' '}
              <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium">
                Voltar à página inicial
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
