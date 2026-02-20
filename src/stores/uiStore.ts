import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  showOnboarding: boolean;
  showConfetti: boolean;
  toasts: Toast[];
  
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setShowOnboarding: (show: boolean) => void;
  triggerConfetti: () => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

interface Toast {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export const useUIStore = create<UIState>((set, get) => ({
  sidebarOpen: true,
  showOnboarding: false,
  showConfetti: false,
  toasts: [],
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  setShowOnboarding: (show) => set({ showOnboarding: show }),
  
  triggerConfetti: () => {
    set({ showConfetti: true });
    setTimeout(() => set({ showConfetti: false }), 3000);
  },
  
  addToast: (toast) => {
    const id = Math.random().toString(36).slice(2);
    set((state) => ({ 
      toasts: [...state.toasts, { ...toast, id }] 
    }));
    
    const duration = toast.duration ?? 5000;
    setTimeout(() => {
      get().removeToast(id);
    }, duration);
  },
  
  removeToast: (id) => set((state) => ({ 
    toasts: state.toasts.filter((t) => t.id !== id) 
  })),
}));
