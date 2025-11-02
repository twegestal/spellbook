import { AppShell, Group, Title } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export function AppShellLayout() {
  return (
    <AppShell header={{ height: 56 }} padding="md" footer={{ height: 64 }}>
      <AppShell.Header px="md">
        <Group h="100%" justify="space-between">
          <Group>
            <Title order={4}>Spellbook</Title>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>

      <AppShell.Footer px="xs" py={0}>
        <BottomNav />
      </AppShell.Footer>
    </AppShell>
  );
}
