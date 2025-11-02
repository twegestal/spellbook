import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { AppRouter } from './router/AppRouter';
import { theme } from './theme';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <Notifications position="top-right" />
      <AppRouter />
    </MantineProvider>
  );
}
