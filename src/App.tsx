import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { AppRouter } from './router/AppRouter';
import { theme } from './theme';
import { ThemeBarSync } from './components/ThemeBarSync';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import './index.css';

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <ThemeBarSync />
      <Notifications position="bottom-center" />
      <AppRouter />
    </MantineProvider>
  );
}
