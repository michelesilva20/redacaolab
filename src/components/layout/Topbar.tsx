import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Zap,
  Flame,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import { mockNotifications } from '../../mocks/classes';
import { RoleSwitcher } from '../RoleSwitcher';
import { cn } from '../../lib/utils';

export function Topbar() {
  const navigate = useNavigate();
  const { user, logout, simulatedRole } = useAuthStore();
  const { toggleSidebar } = useUIStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-xl border-b border-neutral-200">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-neutral-100 rounded-lg lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Buscar temas, aulas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 lg:w-80 pl-10 pr-4 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Gamification stats */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-highlight-50 rounded-full">
              <Zap className="w-4 h-4 text-highlight-500" />
              <span className="text-sm font-medium text-highlight-700">
                {user?.xp || 0} XP
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-50 rounded-full">
              <Flame className="w-4 h-4 text-accent-500" />
              <span className="text-sm font-medium text-accent-700">
                {user?.streak || 0} dias
              </span>
            </div>
          </div>

          {/* Role Switcher */}
          <RoleSwitcher />

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-neutral-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-danger-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-neutral-200 z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-neutral-100">
                      <h3 className="font-semibold text-neutral-800">Notificações</h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {mockNotifications.slice(0, 5).map((notif) => (
                        <Link
                          key={notif.id}
                          to={notif.link || '#'}
                          onClick={() => setShowNotifications(false)}
                          className={cn(
                            'block p-4 hover:bg-neutral-50 transition-colors border-b border-neutral-50',
                            !notif.read && 'bg-primary-50/50'
                          )}
                        >
                          <p className="text-sm font-medium text-neutral-800">
                            {notif.title}
                          </p>
                          <p className="text-xs text-neutral-500 mt-1">
                            {notif.message}
                          </p>
                        </Link>
                      ))}
                    </div>
                    <div className="p-3 border-t border-neutral-100">
                      <Link
                        to="/app/notificacoes"
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Ver todas
                      </Link>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 hover:bg-neutral-100 rounded-xl transition-colors"
            >
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${simulatedRole}`}
                alt="Avatar"
                className="w-8 h-8 rounded-full"
              />
              <ChevronDown className="w-4 h-4 text-neutral-500 hidden sm:block" />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-neutral-200 z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-neutral-100">
                      <p className="font-medium text-neutral-800">{user?.name}</p>
                      <p className="text-sm text-neutral-500">{user?.email}</p>
                    </div>
                    <div className="py-2">
                      <Link
                        to="/app/perfil"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50"
                      >
                        <User className="w-4 h-4" />
                        Meu Perfil
                      </Link>
                      <Link
                        to="/app/configuracoes"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50"
                      >
                        <Settings className="w-4 h-4" />
                        Configurações
                      </Link>
                    </div>
                    <div className="py-2 border-t border-neutral-100">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-danger-600 hover:bg-danger-50 w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        Sair
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
