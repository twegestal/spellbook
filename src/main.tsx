import { createRoot } from 'react-dom/client';
import { ChakraProvider, defaultSystem, Theme } from '@chakra-ui/react';
import { Toaster } from './components/ui/';
import { App } from './App';
import { AuthProvider } from './context/auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <ChakraProvider value={defaultSystem}>
      <Theme appearance="dark">
        <Toaster />
        <AuthProvider>
          <App />
        </AuthProvider>
      </Theme>
    </ChakraProvider>
  </QueryClientProvider>
);
