import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { applyTheme, defaultThemeSelection, resolveTheme } from './theme';
import './index.css';

applyTheme(resolveTheme(defaultThemeSelection));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);