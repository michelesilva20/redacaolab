import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function CTA() {
  return (
    <section className="py-24 bg-gradient-hero relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            Comece sua jornada hoje
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
            Pronto para evoluir sua redação?
          </h2>

          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de estudantes que já estão transformando suas redações com o RedaçãoLab.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button
                size="lg"
                className="bg-white text-primary-600 hover:bg-neutral-100"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Começar grátis agora
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="ghost"
                className="text-white border-2 border-white/30 hover:bg-white/10"
              >
                Ver demonstração
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
