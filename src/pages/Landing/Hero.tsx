import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Zap, Flame, CheckCircle, Star } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function Hero() {
  const [email, setEmail] = useState('');

  return (
    <section className="relative min-h-screen bg-gradient-hero overflow-hidden">
      {/* Background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute top-0 right-0 w-[800px] h-[800px] opacity-20" viewBox="0 0 800 800">
          <circle cx="400" cy="400" r="300" fill="none" stroke="white" strokeWidth="1" />
          <circle cx="400" cy="400" r="200" fill="none" stroke="white" strokeWidth="1" />
          <circle cx="400" cy="400" r="100" fill="none" stroke="white" strokeWidth="1" />
        </svg>
        <div className="absolute top-20 left-10 w-72 h-72 bg-secondary-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl" />
        <svg className="absolute bottom-0 left-0 w-full h-32" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,0 C480,120 960,120 1440,0 L1440,120 L0,120 Z" fill="white" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm mb-6"
            >
              <Star className="w-4 h-4 text-highlight-400" />
              +5.000 alunos já evoluíram suas redações
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-6">
              Redação nota 1000 começa com{' '}
              <span className="text-secondary-300">prática guiada</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-xl">
              Treine, escreva e evolua com correções detalhadas que realmente ajudam.
              Preparação completa para <strong>ENEM, UNESP e Concursos</strong>.
            </p>

            {/* Email Form */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu melhor e-mail"
                className="flex-1 px-5 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <Link to="/login">
                <Button
                  variant="secondary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                  className="w-full sm:w-auto bg-secondary-400 hover:bg-secondary-500"
                >
                  Começar grátis
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-4 text-white/70 text-sm">
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-secondary-400" />
                7 dias grátis
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-secondary-400" />
                Sem cartão de crédito
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-secondary-400" />
                Cancele quando quiser
              </span>
            </div>
          </motion.div>

          {/* Right - Dashboard Mock */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Main Dashboard Card */}
            <div className="relative bg-white rounded-3xl shadow-float p-6 transform rotate-1 hover:rotate-0 transition-transform duration-500">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-neutral-500">Bem-vindo de volta,</p>
                  <h3 className="text-xl font-bold text-neutral-800">Maria 👋</h3>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-highlight-100 rounded-full">
                    <Zap className="w-4 h-4 text-highlight-500" />
                    <span className="text-sm font-semibold text-highlight-700">2400 XP</span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-primary-50 rounded-xl p-4">
                  <p className="text-sm text-primary-600 mb-1">Redações</p>
                  <p className="text-2xl font-bold text-primary-700">12</p>
                </div>
                <div className="bg-secondary-50 rounded-xl p-4">
                  <p className="text-sm text-secondary-600 mb-1">Média</p>
                  <p className="text-2xl font-bold text-secondary-700">820</p>
                </div>
                <div className="bg-accent-50 rounded-xl p-4">
                  <p className="text-sm text-accent-600 mb-1">Streak</p>
                  <div className="flex items-center gap-1">
                    <p className="text-2xl font-bold text-accent-700">7</p>
                    <Flame className="w-5 h-5 text-accent-500" />
                  </div>
                </div>
              </div>

              {/* Mini Chart */}
              <div className="bg-neutral-50 rounded-xl p-4">
                <p className="text-sm font-medium text-neutral-700 mb-3">Evolução semanal</p>
                <div className="flex items-end justify-between h-20 gap-2">
                  {[60, 80, 70, 90, 75, 85, 95].map((height, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="flex-1 bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute -top-8 -left-8 bg-white rounded-2xl shadow-xl p-4 border border-primary-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-secondary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-800">Correção disponível!</p>
                  <p className="text-xs text-neutral-500">Nota: 860</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-4 -right-4 bg-gradient-to-r from-accent-500 to-accent-400 rounded-2xl shadow-xl p-4 text-white"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                <span className="font-semibold">+50 XP</span>
              </div>
              <p className="text-sm opacity-90">Redação enviada!</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 0.5 }}
              className="absolute top-1/3 -right-12 bg-white rounded-xl shadow-lg p-3 border border-highlight-100"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-highlight-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">📝</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-800">Tema do dia</p>
                  <p className="text-xs text-neutral-500">Saúde mental</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
