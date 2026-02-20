import { motion } from 'framer-motion';
import {
  PenTool,
  Camera,
  MessageSquare,
  BarChart3,
  Trophy,
  Clock,
  CheckSquare,
  Sparkles,
} from 'lucide-react';

const features = [
  {
    icon: PenTool,
    title: 'Editor inteligente',
    description: 'Escreva diretamente na plataforma com contagem de palavras e timer integrado.',
    color: 'bg-primary-100 text-primary-600',
  },
  {
    icon: Camera,
    title: 'Envio por foto',
    description: 'Tire foto da sua redação manuscrita e envie para correção. Simples assim.',
    color: 'bg-secondary-100 text-secondary-600',
  },
  {
    icon: MessageSquare,
    title: 'Correção detalhada',
    description: 'Comentários linha a linha com marcações visuais por categoria de erro.',
    color: 'bg-accent-100 text-accent-600',
  },
  {
    icon: BarChart3,
    title: 'Rubrica ENEM',
    description: 'Avaliação nas 5 competências com feedback específico para cada uma.',
    color: 'bg-highlight-100 text-highlight-600',
  },
  {
    icon: Trophy,
    title: 'Gamificação',
    description: 'Ganhe XP, mantenha seu streak e conquiste badges conforme evolui.',
    color: 'bg-success-100 text-success-600',
  },
  {
    icon: Clock,
    title: 'Aulas em vídeo',
    description: 'Aprenda técnicas de escrita com videoaulas organizadas por competência.',
    color: 'bg-primary-100 text-primary-600',
  },
  {
    icon: CheckSquare,
    title: 'Temas variados',
    description: 'Catálogo com dezenas de temas organizados por banca e eixo temático.',
    color: 'bg-secondary-100 text-secondary-600',
  },
  {
    icon: Sparkles,
    title: 'Repertório sugerido',
    description: 'Cada tema vem com sugestões de repertório sociocultural para usar.',
    color: 'bg-accent-100 text-accent-600',
  },
];

export function Features() {
  return (
    <section id="recursos" className="py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Recursos
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-800 mb-4">
            Tudo que você precisa para{' '}
            <span className="text-primary-600">evoluir</span>
          </h2>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
            Ferramentas modernas e metodologia comprovada para você dominar a redação
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-neutral-500 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
