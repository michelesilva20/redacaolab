import { motion } from 'framer-motion';
import { GraduationCap, Award, BookOpen, Target } from 'lucide-react';

const logos = [
  { name: 'ENEM', icon: GraduationCap, subtitle: 'Nota 1000' },
  { name: 'UNESP', icon: BookOpen, subtitle: 'Vestibular' },
  { name: 'Concursos', icon: Target, subtitle: 'Públicos' },
  { name: 'Método', icon: Award, subtitle: 'Por competências' },
];

export function TrustLogos() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-neutral-500 mb-8"
        >
          Preparação completa para os principais vestibulares e concursos
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {logos.map((logo, index) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center gap-2 p-6 rounded-2xl hover:bg-neutral-50 transition-colors"
            >
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-2">
                <logo.icon className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="font-semibold text-neutral-800">{logo.name}</h3>
              <p className="text-sm text-neutral-500">{logo.subtitle}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
