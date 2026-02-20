import { motion } from 'framer-motion';
import { FileText, Edit3, MessageCircle, ArrowRight } from 'lucide-react';

const steps = [
  {
    step: 1,
    icon: FileText,
    title: 'Escolha um tema',
    description: 'Explore nosso catálogo de temas organizados por banca, eixo temático e dificuldade.',
    color: 'from-primary-500 to-primary-600',
  },
  {
    step: 2,
    icon: Edit3,
    title: 'Escreva ou envie foto',
    description: 'Use nosso editor inteligente ou simplesmente tire uma foto da sua redação manuscrita.',
    color: 'from-secondary-500 to-secondary-600',
  },
  {
    step: 3,
    icon: MessageCircle,
    title: 'Receba a correção',
    description: 'Correção detalhada com marcações, comentários e nota por competência em até 72h.',
    color: 'from-accent-500 to-accent-600',
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-800 mb-4">
            Como funciona?
          </h2>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
            Três passos simples para você começar a evoluir sua redação hoje
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary-200 via-secondary-200 to-accent-200" />

          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative text-center"
            >
              <div className="relative inline-flex mb-6">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center font-bold text-neutral-800">
                  {step.step}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-3">
                {step.title}
              </h3>
              <p className="text-neutral-500">
                {step.description}
              </p>
              {index < steps.length - 1 && (
                <ArrowRight className="hidden md:block absolute top-20 -right-4 w-8 h-8 text-neutral-300" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
