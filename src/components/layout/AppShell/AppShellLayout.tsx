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
        styles={{
          root: { height: '100dvh', overflow: 'hidden' },
          main: {
            height: '100%',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            background: 'var(--mantine-color-body)',
          },
        }}
        header={{ height: `calc(${HEADER_BASE}px + env(safe-area-inset-top))` }}
        footer={{
          height: `calc(${FOOTER_BASE}px + env(safe-area-inset-bottom))`,
        }}
        padding={0}
      >
        <AppShell.Header
          px="md"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            background: 'var(--mantine-color-body)',
            borderBottom: '1px solid var(--mantine-color-default-border)',
          }}
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

        <AppShell.Main
          style={{
            paddingTop: 'var(--mantine-spacing-sm)',
            paddingLeft: 'var(--mantine-spacing-md)',
            paddingRight: 'var(--mantine-spacing-md)',
            paddingBottom: `calc(${FOOTER_BASE}px + env(safe-area-inset-bottom))`,
          }}
        >
          <Outlet />
        </AppShell.Main>

        <AppShell.Footer
          px="xs"
          py={0}
          style={{
            position: 'sticky',
            bottom: 0,
            zIndex: 10,
            background: 'var(--mantine-color-body)',
            borderTop: '1px solid var(--mantine-color-default-border)',
          }}
        >
          <Box w="100%" h={FOOTER_BASE} style={{ display: 'flex' }}>
            <BottomNav />
          </Box>
        </AppShell.Footer>
      </AppShell>
    </HeaderCtx.Provider>
  );
}
