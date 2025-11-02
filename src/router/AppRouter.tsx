import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import { AppShellLayout } from '../components/layout/AppShell/AppShellLayout';
import SpellsPage from '../components/pages/SpellsPage';
import { RequireAuth } from './RequireAuth';
import { LoginPage } from '../components/auth/LoginPage';
import { RegisterPage } from '../components/auth/RegisterPage';
import { AuthCallback } from '../components/auth/AuthCallback';
import SettingsPage from '../components/pages/SettingsPage';
import CharactersPage from '../components/pages/CharactersPage';

const router = createBrowserRouter([
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
          { path: '/settings', element: <SettingsPage /> },
        ],
      },
    ],
  },

  { path: '*', element: <Navigate to="/spells" replace /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
