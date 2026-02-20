import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, TrendingUp, Calendar, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

const steps = [
  {
    id: 1,
    title: 'Qual é o seu objetivo?',
    description: 'Escolha o vestibular ou concurso que você está focando',
    icon: Target,
  },
  {
    id: 2,
    title: 'Qual seu nível atual?',
    description: 'Isso nos ajuda a personalizar seu plano de estudos',
    icon: TrendingUp,
  },
  {
    id: 3,
    title: 'Quando você quer estudar?',
    description: 'Selecione os dias da semana que pretende praticar',
    icon: Calendar,
  },
];

const exams = [
  { value: 'enem', label: 'ENEM', description: 'Exame Nacional do Ensino Médio' },
  { value: 'unesp', label: 'UNESP', description: 'Vestibular da Universidade Estadual Paulista' },
  { value: 'concursos', label: 'Concursos', description: 'Concursos públicos diversos' },
];

const levels = [
  { value: 400, label: 'Iniciante', description: 'Estou começando do zero' },
  { value: 600, label: 'Intermediário', description: 'Já escrevo mas quero melhorar' },
  { value: 800, label: 'Avançado', description: 'Busco a nota máxima' },
];

const days = [
  { value: 'segunda', label: 'Seg' },
  { value: 'terca', label: 'Ter' },
  { value: 'quarta', label: 'Qua' },
  { value: 'quinta', label: 'Qui' },
  { value: 'sexta', label: 'Sex' },
  { value: 'sabado', label: 'Sáb' },
  { value: 'domingo', label: 'Dom' },
];

export function OnboardingModal() {
  const { updateOnboarding, updatePreferences } = useAuthStore();
  const { triggerConfetti } = useUIStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<number>(600);
  const [targetScore, setTargetScore] = useState<number>(900);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    updatePreferences({
      targetExam: selectedExam as 'enem' | 'unesp' | 'concursos',
      currentLevel: selectedLevel,
      targetScore,
      weeklyGoal: selectedDays.length,
      preferredDays: selectedDays,
    });
    updateOnboarding(true);
    triggerConfetti();
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedExam !== '';
      case 2:
        return selectedLevel > 0 && targetScore > 0;
      case 3:
        return selectedDays.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-hero p-8 text-white">
          <div className="flex items-center gap-4 mb-6">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-2">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all',
                    currentStep >= step.id
                      ? 'bg-white text-primary-600'
                      : 'bg-white/20 text-white'
                  )}
                >
                  {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                </div>
                {step.id < 3 && (
                  <div
                    className={cn(
                      'w-12 h-1 rounded-full transition-all',
                      currentStep > step.id ? 'bg-white' : 'bg-white/20'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
          <h2 className="text-2xl font-bold">{steps[currentStep - 1].title}</h2>
          <p className="text-white/80 mt-1">{steps[currentStep - 1].description}</p>
        </div>

        {/* Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {exams.map((exam) => (
                  <button
                    key={exam.value}
                    onClick={() => setSelectedExam(exam.value)}
                    className={cn(
                      'w-full p-4 rounded-xl border-2 text-left transition-all',
                      selectedExam === exam.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    )}
                  >
                    <p className="font-semibold text-neutral-800">{exam.label}</p>
                    <p className="text-sm text-neutral-500">{exam.description}</p>
                  </button>
                ))}
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-3">
                    Seu nível atual
                  </label>
                  <div className="space-y-3">
                    {levels.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => setSelectedLevel(level.value)}
                        className={cn(
                          'w-full p-4 rounded-xl border-2 text-left transition-all',
                          selectedLevel === level.value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-neutral-200 hover:border-neutral-300'
                        )}
                      >
                        <p className="font-semibold text-neutral-800">{level.label}</p>
                        <p className="text-sm text-neutral-500">{level.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-3">
                    Meta de nota: {targetScore}
                  </label>
                  <input
                    type="range"
                    min={selectedLevel + 100}
                    max={1000}
                    step={50}
                    value={targetScore}
                    onChange={(e) => setTargetScore(Number(e.target.value))}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                  <div className="flex justify-between text-sm text-neutral-500 mt-2">
                    <span>{selectedLevel + 100}</span>
                    <span>1000</span>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <label className="block text-sm font-medium text-neutral-700 mb-4">
                  Selecione os dias que pretende praticar
                </label>
                <div className="flex flex-wrap gap-3 justify-center">
                  {days.map((day) => (
                    <button
                      key={day.value}
                      onClick={() => toggleDay(day.value)}
                      className={cn(
                        'w-14 h-14 rounded-xl font-medium transition-all',
                        selectedDays.includes(day.value)
                          ? 'bg-primary-500 text-white shadow-lg'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      )}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
                <p className="text-center text-sm text-neutral-500 mt-6">
                  {selectedDays.length} dia{selectedDays.length !== 1 && 's'} selecionado
                  {selectedDays.length !== 1 && 's'} por semana
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-8 pb-8 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Voltar
          </Button>
          <Button
            variant="gradient"
            onClick={handleNext}
            disabled={!canProceed()}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {currentStep === 3 ? 'Começar!' : 'Continuar'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
