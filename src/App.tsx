import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './stores/authStore';

import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Lessons } from './pages/Lessons';
import { LessonDetail } from './pages/Lessons/LessonDetail';
import { Themes } from './pages/Themes';
import { ThemeDetail } from './pages/Themes/ThemeDetail';
import { Essays } from './pages/Essays';
import { NewEssay } from './pages/Essays/NewEssay';
import { EssayDetail } from './pages/Essays/EssayDetail';
import { Correction } from './pages/Correction';
import { Feedback } from './pages/Feedback';
import { Classes } from './pages/Classes';
import { Users } from './pages/Users';
import { Reports } from './pages/Reports';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Help } from './pages/Help';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated && !user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="aulas" element={<Lessons />} />
            <Route path="aulas/:id" element={<LessonDetail />} />
            <Route path="temas" element={<Themes />} />
            <Route path="temas/:id" element={<ThemeDetail />} />
            <Route path="redacoes" element={<Essays />} />
            <Route path="redacoes/nova" element={<NewEssay />} />
            <Route path="redacoes/:id" element={<EssayDetail />} />
            <Route path="correcao/:id" element={<Correction />} />
            <Route path="feedback/:id" element={<Feedback />} />
            <Route path="turmas" element={<Classes />} />
            <Route path="usuarios" element={<Users />} />
            <Route path="relatorios" element={<Reports />} />
            <Route path="perfil" element={<Profile />} />
            <Route path="configuracoes" element={<Settings />} />
            <Route path="ajuda" element={<Help />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
