import { MantineProvider } from '@mantine/core';
import { Global } from '@emotion/react';
import { Notifications } from '@mantine/notifications';
import { AppRouter } from './router/AppRouter';
import { theme } from './theme';
import { ThemeBarSync } from './components/ThemeBarSync';

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
          'body, #root': { background: 'var(--mantine-color-body)' },
        }}
      />
      <ThemeBarSync />
      <Notifications position="top-right" />
      <AppRouter />
    </MantineProvider>
  );
}
