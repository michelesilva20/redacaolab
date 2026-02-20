import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCog, Shield, GraduationCap, User, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { cn } from '../lib/utils';
import type { Role } from '../types';

const roles: { value: Role; label: string; icon: React.ElementType; color: string }[] = [
  { value: 'admin', label: 'Admin', icon: Shield, color: 'text-danger-500 bg-danger-50' },
  { value: 'professor', label: 'Professor', icon: GraduationCap, color: 'text-secondary-600 bg-secondary-50' },
  { value: 'aluno', label: 'Aluno', icon: User, color: 'text-primary-600 bg-primary-50' },
];

export function RoleSwitcher() {
  const { simulatedRole, setSimulatedRole, isSimulatedMode } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const currentRole = roles.find((r) => r.value === simulatedRole) || roles[2];

  if (!isSimulatedMode) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors',
          currentRole.color
        )}
      >
        <UserCog className="w-4 h-4" />
        <span className="text-sm font-medium hidden sm:inline">{currentRole.label}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-neutral-200 z-50 overflow-hidden"
            >
              <div className="p-2 border-b border-neutral-100">
                <p className="text-xs text-neutral-500 px-2">Modo Simulado</p>
              </div>
              <div className="p-2">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    onClick={() => {
                      setSimulatedRole(role.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-colors',
                      simulatedRole === role.value
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-neutral-700 hover:bg-neutral-50'
                    )}
                  >
                    <role.icon className="w-4 h-4" />
                    {role.label}
                    {simulatedRole === role.value && (
                      <span className="ml-auto text-xs bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full">
                        Ativo
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
