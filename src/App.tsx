import { Box, Spinner } from '@chakra-ui/react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/auth';
import { LoginPage } from './components/Login';
import { RegisterPage } from './components/Register';
import { MainShell } from './components/layout/MainShell';

import { SpellsPage } from './pages/SpellsPage';
import { CharactersPage } from './pages/CharactersPage';
import { SettingsPage } from './pages/SettingsPage';
import { CreateCharacterPage } from './pages/CreateCharacterPage';
import { CharacterDetailsPage } from './pages/CharacterDetailsPage';
import { AuthCallback } from './components/AuthCallback';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box minH="100dvh" display="grid" placeItems="center">
        <Spinner />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route
        element={
          <RequireAuth>
            <MainShell />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/spells" replace />} />
        <Route path="/spells" element={<SpellsPage />} />
        <Route path="/characters" element={<CharactersPage />} />
        <Route path="/characters/new" element={<CreateCharacterPage />} />
        <Route path="/characters/:id" element={<CharacterDetailsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/spells" replace />} />
    </Routes>
  );
};
