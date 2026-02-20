import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Inbox } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'search' | 'inbox';
}

const defaultIcons = {
  default: FileText,
  search: Search,
  inbox: Inbox,
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = 'default',
}: EmptyStateProps) {
  const DefaultIcon = defaultIcons[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
        {icon || <DefaultIcon className="w-8 h-8 text-primary-500" />}
      </div>
      <h3 className="text-lg font-semibold text-neutral-800 mb-2">{title}</h3>
      {description && (
        <p className="text-neutral-500 max-w-sm mb-6">{description}</p>
      )}
      {action && (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}
