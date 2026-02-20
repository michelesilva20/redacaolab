import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ToastContainer } from '../ui/Toast';
import { OnboardingModal } from '../onboarding/OnboardingModal';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import { cn } from '../../lib/utils';

export function AppLayout() {
  const { user } = useAuthStore();
  const { sidebarOpen } = useUIStore();
  
  const showOnboarding = user?.role === 'aluno' && !user?.onboardingCompleted;

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col lg:flex-row">
      <Sidebar />
      
      <div
        className={cn(
          'flex-1 flex flex-col min-w-0 w-full transition-all duration-300',
          sidebarOpen ? 'lg:ml-[280px]' : 'lg:ml-0'
        )}
      >
        <Topbar />
        
        <main className="flex-1 p-4 lg:p-6 min-h-[calc(100vh-4rem)] overflow-auto">
          <Outlet />
        </main>
      </div>

      <ToastContainer />
      
      {showOnboarding && <OnboardingModal />}
    </div>
  );
}
