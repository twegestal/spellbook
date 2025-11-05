import { useEffect } from 'react';
import { Button, Card, Stack, Text, Title, Divider, Box } from '@mantine/core';
import { useAuth } from '../../context/auth';
import { useHeader } from '../layout/AppShell/AppShellLayout';
import { ColorSchemeToggle } from '../layout/ColorSchemeToggle';

export default function SettingsPage() {
  const { logout } = useAuth();
  const { setLeft, setRight } = useHeader();

  useEffect(() => {
    setLeft(<Title order={4}>Settings</Title>);
    setRight(null);
  }, [setLeft, setRight]);

  return (
    <Box p="md">
      <Stack gap="lg" maw={480} mx="auto">
        <Card withBorder padding="lg" radius="md">
          <Stack gap="xs">
            <Text fw={600}>Profile</Text>
            <Text c="dimmed" fz="sm">
              Perhaps some account settings later
            </Text>
            <Divider my="sm" />
            <Button color="red" variant="light" onClick={logout}>
              Logout
            </Button>
          </Stack>
        </Card>

        <Card withBorder padding="lg" radius="md">
          <Stack gap="xs">
            <Text fw={600}>Preferences</Text>
            <Text c="dimmed" fz="sm">
              Customize your app appearance.
            </Text>
            <Divider my="sm" />
            <ColorSchemeToggle />
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}
