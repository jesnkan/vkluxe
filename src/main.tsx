import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

console.log('VK Luxe: Initializing Atelier...');

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('VK Luxe: Critical failure - root element not found in DOM.');
} else {
  try {
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>,
    );
    console.log('VK Luxe: Atelier rendered successfully.');
  } catch (err) {
    console.error('VK Luxe: Atelier startup crash:', err);
  }
}
