import { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Stack,
  chakra,
} from '@chakra-ui/react';
import { toaster, PasswordInput } from './ui';
import { useAuth } from '../context/auth';

export const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      toaster.create({
        title: 'Logged in',
        type: 'success',
        closable: true,
      });
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
          </Stack>
        </Box>
      </chakra.form>
    </Flex>
  );
};
