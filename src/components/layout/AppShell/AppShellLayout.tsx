import { createContext, useContext, useMemo, useState } from 'react';
import { AppShell, Burger, Group, Title, Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet } from 'react-router-dom';
import { NavBar } from './Navbar';

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
  const [opened, { toggle, close }] = useDisclosure();
  const [left, setLeft] = useState<React.ReactNode>(
    <Title order={4}>Spellbook</Title>
  );
  const [right, setRight] = useState<React.ReactNode>(null);
  const headerAPI = useMemo(() => ({ setLeft, setRight }), []);

  return (
    <HeaderCtx.Provider value={headerAPI}>
      <AppShell
        padding="md"
        header={{ height: 'calc(60px + var(--safe-top))' }}
        navbar={{
          width: 280,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
      >
        <AppShell.Header px="md" style={{ paddingTop: 'var(--safe-top)' }}>
          <Group h="100%" px="md" justify="space-between" wrap="nowrap">
            <Group wrap="nowrap" gap="sm">
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                size="sm"
              />
              <Box>{left}</Box>
            </Group>

            <Group wrap="nowrap" gap="sm">
              {right}
            </Group>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p="xs">
          <NavBar close={close} />
        </AppShell.Navbar>

        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </HeaderCtx.Provider>
  );
}
