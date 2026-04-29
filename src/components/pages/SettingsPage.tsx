import { useEffect } from 'react';
import { Card, Stack, Text, Title, Divider, Box } from '@mantine/core';
import { useHeader } from '../layout/AppShell/AppShellLayout';
import { ColorSchemeToggle } from '../layout/ColorSchemeToggle';
import { CharacterManager } from '../settings/CharacterManager';

export default function SettingsPage() {
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
            <Text fw={600}>Preferences</Text>
            <Text c="dimmed" fz="sm">
              Customize your app appearance.
            </Text>
            <Divider my="sm" />
            <ColorSchemeToggle />
          </Stack>
        </Card>

        <Card withBorder padding="lg" radius="md">
          <CharacterManager />
        </Card>
      </Stack>
    </Box>
  );
}
