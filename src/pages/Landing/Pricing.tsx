import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Star, Zap } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { cn } from '../../lib/utils';

const plans = [
  {
    name: 'Starter',
    description: 'Para quem está começando',
    price: 29,
    period: '/mês',
    features: [
      '3 correções por mês',
      'Acesso às aulas básicas',
      'Temas ilimitados',
      'Feedback por competência',
      'Suporte por email',
    ],
    cta: 'Começar agora',
    popular: false,
  },
  {
    name: 'Pro',
    description: 'Ideal para quem quer evoluir',
    price: 59,
    period: '/mês',
    features: [
      '10 correções por mês',
      'Todas as aulas e materiais',
      'Temas ilimitados',
      'Correção detalhada linha a linha',
      'Gamificação completa',
      'Suporte prioritário',
      'Relatório de evolução',
    ],
    cta: 'Assinar Pro',
    popular: true,
  },
  {
    name: 'Premium',
    description: 'Para quem busca a nota máxima',
    price: 99,
    period: '/mês',
    features: [
      'Correções ilimitadas',
      'Todas as aulas e materiais',
      'Mentoria em grupo',
      'Correção em até 24h',
      'Análise de evolução personalizada',
      'Suporte via WhatsApp',
      'Simulados exclusivos',
      'Certificado de conclusão',
    ],
    cta: 'Quero o Premium',
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="planos" className="py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 bg-highlight-100 text-highlight-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            Preços
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-800 mb-4">
            Planos para todos os objetivos
          </h2>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
            Escolha o plano ideal para o seu momento. Todos incluem 7 dias grátis.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'relative bg-white rounded-3xl p-8 shadow-card transition-all duration-300 hover:shadow-card-hover',
                plan.popular && 'ring-2 ring-primary-500 scale-105 z-10'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 bg-gradient-cta text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-lg">
                    <Star className="w-4 h-4" />
                    Mais popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                  {plan.name}
                </h3>
                <p className="text-neutral-500 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-neutral-800">
                    R${plan.price}
                  </span>
                  <span className="text-neutral-500">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
                    <span className="text-neutral-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/login" className="block">
                <Button
                  variant={plan.popular ? 'gradient' : 'outline'}
                  className="w-full"
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
