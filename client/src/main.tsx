import { QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { createQueryClient } from './lib/queryClient';
import './styles/globals.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Missing #root element in index.html');

const queryClient = createQueryClient();

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
