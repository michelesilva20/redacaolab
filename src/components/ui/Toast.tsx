import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { cn } from '../../lib/utils';

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const styles = {
  success: 'bg-success-50 border-success-200 text-success-800',
  error: 'bg-danger-50 border-danger-200 text-danger-800',
  warning: 'bg-highlight-50 border-highlight-200 text-highlight-800',
  info: 'bg-primary-50 border-primary-200 text-primary-800',
};

const iconStyles = {
  success: 'text-success-500',
  error: 'text-danger-500',
  warning: 'text-highlight-500',
  info: 'text-primary-500',
};

export function ToastContainer() {
  const { toasts, removeToast } = useUIStore();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100 }}
              className={cn(
                'flex items-start gap-3 p-4 rounded-xl border shadow-lg min-w-[300px] max-w-md',
                styles[toast.type]
              )}
            >
              <Icon className={cn('w-5 h-5 mt-0.5 flex-shrink-0', iconStyles[toast.type])} />
              <div className="flex-1">
                <p className="font-medium">{toast.title}</p>
                {toast.message && (
                  <p className="text-sm opacity-80 mt-1">{toast.message}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 hover:bg-black/5 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
