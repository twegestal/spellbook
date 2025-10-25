import { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Stack,
  chakra,
  Link,
  Separator,
  HStack,
  Text,
} from '@chakra-ui/react';
import { toaster, PasswordInput } from './ui';
import { useAuth } from '../context/auth';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { GoogleLoginButton } from './GoogleLoginButton';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      toaster.create({ title: 'Logged in', type: 'success', closable: true });
      navigate('/spells', { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected error';
      toaster.create({
        title: 'Login failed',
        description: message,
        type: 'error',
        closable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Flex minH="100dvh" align="center" justify="center" px="4">
      <chakra.form onSubmit={onSubmit} style={{ width: '100%', maxWidth: 400 }}>
        <Box p="6" borderWidth="1px" borderRadius="md">
          <Stack gap="6">
            <Heading size="md" textAlign="center">
              Sign in
            </Heading>

            <Stack gap="2">
              <chakra.label htmlFor="email" fontSize="sm" color="fg.muted">
                Email
              </chakra.label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                required
              />
            </Stack>

            <Stack gap="2">
              <chakra.label htmlFor="password" fontSize="sm" color="fg.muted">
                Password
              </chakra.label>
              <PasswordInput
                id="password"
                autoComplete="current-password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                required
              />
            </Stack>

            <Button type="submit" loading={submitting} colorPalette="purple">
              Sign in
            </Button>

            <HStack>
              <Separator />
              <Text fontSize="xs" color="fg.muted">
                or
              </Text>
              <Separator />
            </HStack>

            <GoogleLoginButton label="Continue with Google" />

            <Stack gap="1" align="center" fontSize="sm">
              <span>Don’t have an account?</span>
              <Link asChild variant="underline" colorPalette="purple">
                <RouterLink to="/register">Create one</RouterLink>
              </Link>
            </Stack>
          </Stack>
        </Box>
      </chakra.form>
    </Flex>
  );
};
