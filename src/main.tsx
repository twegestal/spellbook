import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { AuthProvider } from './context/AuthProvider';
import { registerSW } from 'virtual:pwa-register';

const params = new URLSearchParams(window.location.search);
const debug = params.get('debug') === '1';
const noSw = params.get('nosw') === '1';

if (debug) {
  const show = (title: string, msg: unknown) => {
    document.body.style.background = '#111';
    document.body.innerHTML =
      `<pre style="color:#fff;white-space:pre-wrap;padding:12px;">${title}\n\n` +
      String(msg) +
      `</pre>`;
  };

  window.addEventListener('error', (e: any) => {
    show('JS Error:', e?.error?.stack || e?.message || e);
  });

  window.addEventListener('unhandledrejection', (e: any) => {
    show('Unhandled Promise:', e?.reason?.stack || e?.reason || e);
  });
}

if (!noSw) {
  registerSW({ immediate: true });
}

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </QueryClientProvider>
);
