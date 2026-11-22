import '@fontsource-variable/inter';
import './styles/globals.css';
import './lib/i18n';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { createQueryClient } from './lib/queryClient';
import { AppProviders } from './providers/AppProviders';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Missing #root element in index.html');

const queryClient = createQueryClient();

createRoot(rootElement).render(
  <StrictMode>
    <AppProviders queryClient={queryClient}>
      <App />
    </AppProviders>
  </StrictMode>,
);
