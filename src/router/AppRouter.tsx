import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { ModalsProvider } from '@mantine/modals';
import { AppShellLayout } from '../components/layout/AppShell/AppShellLayout';
import SpellsPage from '../components/pages/SpellsPage';
import { RequireAuth } from './RequireAuth';
import { LoginPage } from '../components/auth/LoginPage';
import { RegisterPage } from '../components/auth/RegisterPage';
import { AuthCallback } from '../components/auth/AuthCallback';
import SettingsPage from '../components/pages/SettingsPage';
import CharactersPage from '../components/pages/CharactersPage';
import CreateCharacterPage from '../components/pages/CreateCharacterPage';
import CharacterDetailsPage from '../components/pages/CharacterDetailsPage';
import HomebrewPage from '../components/pages/HomebrewPage';

function RouterLevelProviders() {
  return (
    <ModalsProvider>
      <Outlet />
    </ModalsProvider>
  );
}

const router = createBrowserRouter([
  {
    element: <RouterLevelProviders />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/auth/callback', element: <AuthCallback /> },

      {
        element: <RequireAuth />,
        children: [
          {
            element: <AppShellLayout />,
            children: [
              { index: true, element: <Navigate to="/spells" replace /> },
              { path: '/spells', element: <SpellsPage /> },
              { path: '/characters', element: <CharactersPage /> },
              { path: '/characters/new', element: <CreateCharacterPage /> },
              { path: '/characters/:id', element: <CharacterDetailsPage /> },
              { path: '/settings', element: <SettingsPage /> },
              { path: '/spells/homebrew', element: <HomebrewPage /> },
            ],
          },
        ],
      },

      { path: '*', element: <Navigate to="/spells" replace /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
