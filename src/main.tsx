import { createRoot } from 'react-dom/client';
import {
  ChakraProvider,
  defaultSystem,
  Theme,
  EnvironmentProvider,
} from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from './components/ui/';
import { App } from './App';
import { AuthProvider } from './context/AuthProvider';

import './index.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <ChakraProvider value={defaultSystem}>
      <EnvironmentProvider>
        <Theme appearance="dark">
          <Toaster />
          <AuthProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </AuthProvider>
        </Theme>
      </EnvironmentProvider>
    </ChakraProvider>
  </QueryClientProvider>
);
