import { Fragment, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showClose?: boolean;
}

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[90vw]',
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showClose = true,
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className={cn(
                'w-full bg-white rounded-2xl shadow-xl overflow-hidden',
                sizes[size]
              )}
            >
              {(title || showClose) && (
                <div className="flex items-center justify-between p-6 border-b border-neutral-100">
                  <div>
                    {title && (
                      <h2 className="text-xl font-semibold text-neutral-800">
                        {title}
                      </h2>
                    )}
                    {description && (
                      <p className="text-sm text-neutral-500 mt-1">
                        {description}
                      </p>
                    )}
                  </div>
                  {showClose && (
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-neutral-500" />
                    </button>
                  )}
                </div>
              )}
              <div className="p-6">{children}</div>
            </motion.div>
          </div>
        </Fragment>
      )}
    </AnimatePresence>
  );
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'primary',
  isLoading = false,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showClose={false}>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-neutral-800 mb-2">{title}</h3>
        <p className="text-neutral-500 mb-6">{description}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              'px-4 py-2 rounded-lg text-white transition-colors disabled:opacity-50',
              variant === 'danger'
                ? 'bg-danger-500 hover:bg-danger-600'
                : 'bg-primary-600 hover:bg-primary-700'
            )}
          >
            {isLoading ? 'Aguarde...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
