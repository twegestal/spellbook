import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { AppRouter } from './router/AppRouter';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';

export default function App() {
  return (
    <MantineProvider defaultColorScheme="auto">
      <Notifications position="top-right" />
      <ModalsProvider>
        <AppRouter />
      </ModalsProvider>
    </MantineProvider>
  );
}
