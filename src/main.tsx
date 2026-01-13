import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { AuthProvider } from './context/AuthProvider';
import { registerSW } from 'virtual:pwa-register';

window.addEventListener('error', (e) => {
  document.body.innerHTML = `<pre style="white-space:pre-wrap;padding:16px">
JS error: ${String(e.message)}
${(e as any).filename || ''}:${(e as any).lineno || ''}:${
    (e as any).colno || ''
  }
</pre>`;
});

window.addEventListener('unhandledrejection', (e) => {
  document.body.innerHTML = `<pre style="white-space:pre-wrap;padding:16px">
Unhandled promise rejection:
${String((e as PromiseRejectionEvent).reason)}
</pre>`;
});

registerSW({ immediate: true });

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </QueryClientProvider>
);
