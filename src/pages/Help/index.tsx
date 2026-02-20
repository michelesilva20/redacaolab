import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  ChevronDown,
  MessageCircle,
  Mail,
  BookOpen,
  Video,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { cn } from '../../lib/utils';

const faqs = [
  {
    question: 'Como envio minha redação?',
    answer: 'Você pode escrever diretamente no editor da plataforma ou tirar uma foto da sua redação manuscrita. Acesse "Nova Redação" no menu, escolha o tema e a modalidade (digitada ou foto).',
  },
  {
    question: 'Quanto tempo leva para receber a correção?',
    answer: 'O prazo padrão é de até 72 horas. No plano Premium, o prazo é de até 24 horas. Você receberá uma notificação quando a correção estiver disponível.',
  },
  {
    question: 'Como funciona a avaliação por competências?',
    answer: 'Seguimos a metodologia do ENEM, avaliando 5 competências: Domínio da norma culta (C1), Compreensão do tema (C2), Argumentação (C3), Coesão textual (C4) e Proposta de intervenção (C5). Cada uma vale até 200 pontos.',
  },
  {
    question: 'Posso refazer uma redação após a correção?',
    answer: 'Sim! Após receber o feedback, você pode clicar em "Refazer com base no feedback" para criar uma nova redação sobre o mesmo tema, aplicando as sugestões do professor.',
  },
  {
    question: 'Como funcionam os XP e as conquistas?',
    answer: 'Você ganha XP ao completar ações como assistir aulas, enviar redações e revisar correções. Com o XP, você sobe de nível e desbloqueia conquistas especiais. O streak conta os dias consecutivos de prática.',
  },
  {
    question: 'Posso mudar meu plano?',
    answer: 'Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento acessando as configurações da conta. A diferença será calculada proporcionalmente.',
  },
];

const resources = [
  {
    icon: BookOpen,
    title: 'Guia de Início',
    description: 'Aprenda a usar a plataforma',
    link: '#',
  },
  {
    icon: Video,
    title: 'Tutoriais em Vídeo',
    description: 'Vídeos explicativos',
    link: '#',
  },
  {
    icon: FileText,
    title: 'Documentação',
    description: 'Informações detalhadas',
    link: '#',
  },
];

export function Help() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-neutral-800">Central de Ajuda</h1>
        <p className="text-neutral-500">Encontre respostas e entre em contato</p>
      </div>

      {/* Quick Resources */}
      <div className="grid md:grid-cols-3 gap-4">
        {resources.map((resource, index) => (
          <motion.a
            key={resource.title}
            href={resource.link}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="block"
          >
            <Card hover className="h-full">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <resource.icon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-800 mb-1">{resource.title}</h3>
                  <p className="text-sm text-neutral-500">{resource.description}</p>
                </div>
              </div>
            </Card>
          </motion.a>
        ))}
      </div>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-secondary-600" />
            </div>
            <CardTitle>Perguntas frequentes</CardTitle>
          </div>
        </CardHeader>
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-neutral-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-neutral-50"
              >
                <span className="font-medium text-neutral-800">{faq.question}</span>
                <ChevronDown
                  className={cn(
                    'w-5 h-5 text-neutral-500 transition-transform',
                    openFaq === index && 'rotate-180'
                  )}
                />
              </button>
              <AnimatePresence>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <div className="px-4 pb-4">
                      <p className="text-neutral-600">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </Card>

      {/* Contact Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-accent-600" />
            </div>
            <div>
              <CardTitle>Entre em contato</CardTitle>
              <p className="text-sm text-neutral-500">Não encontrou o que procurava?</p>
            </div>
          </div>
        </CardHeader>
        <div className="space-y-4">
          <Input
            label="Assunto"
            placeholder="Qual é o assunto?"
            value={contactForm.subject}
            onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
          />
          <Textarea
            label="Mensagem"
            placeholder="Descreva sua dúvida ou problema..."
            rows={5}
            value={contactForm.message}
            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
          />
          <div className="flex justify-end">
            <Button variant="gradient" leftIcon={<Mail className="w-4 h-4" />}>
              Enviar mensagem
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
