import { MantineProvider } from '@mantine/core';
import { Global } from '@emotion/react';
import { Notifications } from '@mantine/notifications';
import { AppRouter } from './router/AppRouter';
import { theme } from './theme';
import { ThemeColorMeta } from './components/ThemeColorMeta';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <Global
        styles={{
          ':root': { colorScheme: 'light dark' },
          'html, body, #root': { height: '100%' },
          'body, #root': {
            background: 'var(--mantine-color-body)',
          },
          '#root': {
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
          },
        }}
      />

      <ThemeColorMeta />

      <Notifications position="top-right" />
      <AppRouter />
    </MantineProvider>
  );
}
