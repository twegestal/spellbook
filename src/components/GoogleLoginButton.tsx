import { useState } from 'react';
import { Button, HStack, Image, Text } from '@chakra-ui/react';
import { supabase } from '../util/authClient';
import { toaster } from './ui';

export const GoogleLoginButton = ({
  label = 'Sign in with Google',
}: {
  label?: string;
}) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unexpected error';
      toaster.create({
        title: 'Google sign-in failed',
        description: msg,
        type: 'error',
        closable: true,
      });
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLogin}
      loading={loading}
      width="100%"
      justifyContent="center"
      variant="surface"
      bg="white"
      border="1px solid"
      borderColor="gray.300"
      _hover={{ bg: 'gray.50' }}
      _active={{ bg: 'gray.100' }}
      _dark={{
        bg: 'gray.800',
        borderColor: 'gray.700',
        _hover: { bg: 'gray.700' },
      }}
      color="black"
      fontWeight="medium"
      shadow="sm"
    >
      <HStack>
        <Image
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          boxSize="18px"
        />
        <Text>{label}</Text>
      </HStack>
    </Button>
  );
};
