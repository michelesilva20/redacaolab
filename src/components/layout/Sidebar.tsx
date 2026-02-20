import { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  PenTool,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  GraduationCap,
  CheckSquare,
  X,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import { cn } from '../../lib/utils';
import type { Role } from '../../types';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: Role[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/app', icon: LayoutDashboard, roles: ['admin', 'professor', 'aluno'] },
  { label: 'Aulas', href: '/app/aulas', icon: BookOpen, roles: ['admin', 'professor', 'aluno'] },
  { label: 'Temas', href: '/app/temas', icon: FileText, roles: ['admin', 'professor', 'aluno'] },
  { label: 'Redações', href: '/app/redacoes', icon: PenTool, roles: ['admin', 'professor', 'aluno'] },
  { label: 'Turmas', href: '/app/turmas', icon: GraduationCap, roles: ['admin', 'professor'] },
  { label: 'Usuários', href: '/app/usuarios', icon: Users, roles: ['admin'] },
  { label: 'Relatórios', href: '/app/relatorios', icon: BarChart3, roles: ['admin', 'professor'] },
  { label: 'Configurações', href: '/app/configuracoes', icon: Settings, roles: ['admin'] },
  { label: 'Ajuda', href: '/app/ajuda', icon: HelpCircle, roles: ['admin', 'professor', 'aluno'] },
];

const LG_BREAKPOINT = 1024;

export function Sidebar() {
  const location = useLocation();
  const { user, simulatedRole } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  
  const currentRole = user?.role || simulatedRole;
  const filteredItems = navItems.filter((item) => item.roles.includes(currentRole));

  /** Só fecha a sidebar ao clicar no link em mobile/tablet (drawer). Em desktop ela deve permanecer visível. */
  const handleNavClick = () => {
    if (window.innerWidth < LG_BREAKPOINT) {
      setSidebarOpen(false);
    }
  };

  /** Em desktop (lg+), manter sidebar sempre visível ao redimensionar. */
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= LG_BREAKPOINT) {
        setSidebarOpen(true);
      }
    };
    handler();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [setSidebarOpen]);

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : -280,
          width: 280,
        }}
        className={cn(
          'fixed left-0 top-0 h-screen bg-white border-r border-neutral-200 z-50',
          'flex flex-col flex-shrink-0',
          'lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-neutral-100">
          <NavLink to="/app" onClick={handleNavClick} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-cta flex items-center justify-center">
              <PenTool className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-neutral-800">
              Redação<span className="text-primary-600">Lab</span>
            </span>
          </NavLink>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-neutral-100 rounded-lg lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <ul className="space-y-1">
            {filteredItems.map((item) => {
              const isActive =
                location.pathname === item.href ||
                (item.href !== '/app' && location.pathname.startsWith(item.href));

              return (
                <li key={item.href}>
                  <NavLink
                    to={item.href}
                    onClick={handleNavClick}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800'
                    )}
                  >
                    <item.icon className={cn('w-5 h-5', isActive && 'text-primary-600')} />
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-indicator"
                        className="absolute left-0 w-1 h-8 bg-primary-600 rounded-r-full"
                      />
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User card */}
        <div className="p-4 border-t border-neutral-100">
          <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-xl">
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentRole}`}
              alt="Avatar"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-800 truncate">
                {user?.name || 'Usuário'}
              </p>
              <p className="text-xs text-primary-600 capitalize">{currentRole}</p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
