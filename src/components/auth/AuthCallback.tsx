import { useEffect } from 'react';
import { Center, Loader } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth';

export function AuthCallback() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      navigate(user ? '/spells' : '/login', { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <Center mih="60vh">
      <Loader />
    </Center>
  );
}
