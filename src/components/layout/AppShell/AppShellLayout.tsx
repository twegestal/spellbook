import { useMemo, useState, createContext, useContext } from 'react';
import { AppShell, Group, Title } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

type HeaderAPI = {
  setLeft: (node: React.ReactNode) => void;
  setRight: (node: React.ReactNode) => void;
};

const HeaderCtx = createContext<HeaderAPI | null>(null);
export function useHeader() {
  const ctx = useContext(HeaderCtx);
  if (!ctx) throw new Error('useHeader must be used within AppShellLayout');
  return ctx;
}

export function AppShellLayout() {
  const [left, setLeft] = useState<React.ReactNode>(
    <Title order={4}>Spellbook</Title>
  );
  const [right, setRight] = useState<React.ReactNode>(null);

  const headerAPI = useMemo(() => ({ setLeft, setRight }), []);

  return (
    <HeaderCtx.Provider value={headerAPI}>
      <AppShell header={{ height: 56 }} padding="md" footer={{ height: 64 }}>
        <AppShell.Header px="md">
          <Group h="100%" justify="space-between" wrap="nowrap">
            <Group gap="sm" wrap="nowrap">
              {left}
            </Group>
            <Group gap="sm" wrap="nowrap">
              {right}
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
    </HeaderCtx.Provider>
  );
}
