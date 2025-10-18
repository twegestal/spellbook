import { useAuth } from './context/auth';
import { LoginPage } from './components/Login';
import { Box, Spinner } from '@chakra-ui/react';
import { MainShell } from './components/MainShell';

export const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box minH="100dvh" display="grid" placeItems="center">
        <Spinner />
      </Box>
    );
  }

  return user ? <MainShell /> : <LoginPage />;
};
