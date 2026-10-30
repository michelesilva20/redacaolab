import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleRoute } from './components/RoleRoute';
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
            <Route
              index
              element={
                <RoleRoute permission="dashboard">
                  <Dashboard />
                </RoleRoute>
              }
            />
            <Route
              path="aulas"
              element={
                <RoleRoute permission="lessons">
                  <Lessons />
                </RoleRoute>
              }
            />
            <Route
              path="aulas/:id"
              element={
                <RoleRoute permission="lessons">
                  <LessonDetail />
                </RoleRoute>
              }
            />
            <Route
              path="temas"
              element={
                <RoleRoute permission="themes">
                  <Themes />
                </RoleRoute>
              }
            />
            <Route
              path="temas/:id"
              element={
                <RoleRoute permission="themes">
                  <ThemeDetail />
                </RoleRoute>
              }
            />
            <Route
              path="redacoes"
              element={
                <RoleRoute permission="essays">
                  <Essays />
                </RoleRoute>
              }
            />
            <Route
              path="redacoes/nova"
              element={
                <RoleRoute permission="essayCreate">
                  <NewEssay />
                </RoleRoute>
              }
            />
            <Route
              path="redacoes/:id/editar"
              element={
                <RoleRoute permission="essayEdit">
                  <NewEssay />
                </RoleRoute>
              }
            />
            <Route
              path="redacoes/:id"
              element={
                <RoleRoute permission="essayDetail">
                  <EssayDetail />
                </RoleRoute>
              }
            />
            <Route
              path="correcao/:id"
              element={
                <RoleRoute permission="correction">
                  <Correction />
                </RoleRoute>
              }
            />
            <Route
              path="feedback/:id"
              element={
                <RoleRoute permission="feedback">
                  <Feedback />
                </RoleRoute>
              }
            />
            <Route
              path="turmas"
              element={
                <RoleRoute permission="classes">
                  <Classes />
                </RoleRoute>
              }
            />
            <Route
              path="usuarios"
              element={
                <RoleRoute permission="users">
                  <Users />
                </RoleRoute>
              }
            />
            <Route
              path="relatorios"
              element={
                <RoleRoute permission="reports">
                  <Reports />
                </RoleRoute>
              }
            />
            <Route
              path="perfil"
              element={
                <RoleRoute permission="profile">
                  <Profile />
                </RoleRoute>
              }
            />
            <Route
              path="configuracoes"
              element={
                <RoleRoute permission="settings">
                  <Settings />
                </RoleRoute>
              }
            />
            <Route
              path="ajuda"
              element={
                <RoleRoute permission="help">
                  <Help />
                </RoleRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
