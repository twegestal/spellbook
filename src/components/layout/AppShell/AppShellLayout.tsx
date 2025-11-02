import { useMemo, useState, createContext, useContext } from 'react';
import { AppShell, Group, Title, Box } from '@mantine/core';
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
  const HEADER_BASE = 56;
  const FOOTER_BASE = 64;

  const [left, setLeft] = useState<React.ReactNode>(
    <Title order={4}>Spellbook</Title>
  );
  const [right, setRight] = useState<React.ReactNode>(null);

  const headerAPI = useMemo(() => ({ setLeft, setRight }), []);

  return (
    <HeaderCtx.Provider value={headerAPI}>
      <AppShell
        header={{ height: `calc(${HEADER_BASE}px + env(safe-area-inset-top))` }}
        footer={{
          height: `calc(${FOOTER_BASE}px + env(safe-area-inset-bottom))`,
        }}
        padding="md"
      >
        <AppShell.Header
          px="md"
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
          <Group h={HEADER_BASE} justify="space-between" wrap="nowrap">
            <Group gap="sm" wrap="nowrap">
              {left}
            </Group>
            <Group gap="sm" wrap="nowrap">
              {right}
            </Group>
          </Group>
        </AppShell.Header>

        <AppShell.Main style={{ background: 'var(--mantine-color-body)' }}>
          <Outlet />
        </AppShell.Main>

        <AppShell.Footer
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          px="xs"
          py={0}
        >
          <Box w="100%" h={FOOTER_BASE} style={{ display: 'flex' }}>
            <BottomNav />
          </Box>
        </AppShell.Footer>
      </AppShell>
    </HeaderCtx.Provider>
  );
}
