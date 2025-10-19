// src/App.tsx
import { Box, Spinner } from '@chakra-ui/react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/auth';
import { LoginPage } from './components/Login';
import { MainShell } from './components/layout/MainShell';

// pages
import { SpellsPage } from './pages/SpellsPage';
import { CharactersPage } from './pages/CharactersPage';
import { SettingsPage } from './pages/SettingsPage';
import { CreateCharacterPage } from './pages/CreateCharacterPage';

export const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box minH="100dvh" display="grid" placeItems="center">
        <Spinner />
      </Box>
    );
  }

  if (!user) return <LoginPage />;

  return (
    <Routes>
      <Route element={<MainShell />}>
        <Route index element={<Navigate to="/spells" replace />} />
        <Route path="/spells" element={<SpellsPage />} />
        <Route path="/characters" element={<CharactersPage />} />
        <Route path="/characters/new" element={<CreateCharacterPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/spells" replace />} />
      </Route>
    </Routes>
  );
};
