import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

const faqs = [
  {
    question: 'Como funciona o período de teste grátis?',
    answer: 'Você tem 7 dias para experimentar todos os recursos do plano escolhido sem pagar nada. Se não gostar, basta cancelar antes do fim do período e você não será cobrado.',
  },
  {
    question: 'Em quanto tempo recebo a correção?',
    answer: 'O prazo padrão é de até 72 horas para os planos Starter e Pro. No plano Premium, a correção é entregue em até 24 horas.',
  },
  {
    question: 'Posso enviar redação manuscrita?',
    answer: 'Sim! Você pode escrever diretamente no nosso editor ou tirar uma foto da sua redação manuscrita. A foto precisa estar legível e bem iluminada.',
  },
  {
    question: 'Como é feita a correção?',
    answer: 'Todas as correções são feitas por professores especialistas seguindo a metodologia do ENEM (5 competências). Cada redação recebe comentários linha a linha e feedback detalhado.',
  },
  {
    question: 'Posso mudar de plano depois?',
    answer: 'Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. A diferença será calculada proporcionalmente.',
  },
  {
    question: 'Vocês preparam para quais vestibulares?',
    answer: 'Temos conteúdo específico para ENEM, UNESP e principais concursos públicos. Nosso foco é a redação dissertativo-argumentativa, mas adaptamos os critérios conforme a banca.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 bg-secondary-100 text-secondary-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <HelpCircle className="w-4 h-4" />
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-800 mb-4">
            Perguntas frequentes
          </h2>
          <p className="text-lg text-neutral-500">
            Tire suas dúvidas sobre o RedaçãoLab
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-neutral-50 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-semibold text-neutral-800 pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    'w-5 h-5 text-neutral-500 transition-transform flex-shrink-0',
                    openIndex === index && 'rotate-180'
                  )}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-6">
                      <p className="text-neutral-600">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
