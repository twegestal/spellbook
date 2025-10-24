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
  HStack,
  Separator,
  Text,
} from '@chakra-ui/react';
import { toaster, PasswordInput } from './ui';
import { useAuth } from '../context/auth';
import { Link as RouterLink } from 'react-router-dom';
import { GoogleLoginButton } from './GoogleLoginButton';

export const RegisterPage = () => {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await register(email.trim(), password);
      toaster.create({
        title: 'Account created',
        description: 'If required, please confirm via the email we sent you.',
        type: 'success',
        closable: true,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected error';
      toaster.create({
        title: 'Registration failed',
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
              Create an account
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
                autoComplete="new-password"
                placeholder="Choose a strong password"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                required
              />
            </Stack>

            <Button type="submit" loading={submitting} colorPalette="purple">
              Create account
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
              <span>Already have an account?</span>
              <Link asChild variant="underline" colorPalette="purple">
                <RouterLink to="/login">Sign in</RouterLink>
              </Link>
            </Stack>
          </Stack>
        </Box>
      </chakra.form>
    </Flex>
  );
};
