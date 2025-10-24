import { useEffect } from 'react';
import { Box, Spinner } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../util/authClient';

export const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      await supabase.auth.exchangeCodeForSession(window.location.href);
      navigate('/spells', { replace: true });
    })();
  }, [navigate]);

  return (
    <Box minH="100dvh" display="grid" placeItems="center">
      <Spinner />
    </Box>
  );
};
