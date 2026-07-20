import './styles/tokens.css';
import './styles/global.css';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Makes the React module identity visible on boot — the cheapest way to
// confirm only one React instance is on the page across federated bundles.
console.info('[mf-portal] React version:', React.version);

const container = document.getElementById('root');
if (!container) throw new Error('#root not found');
createRoot(container).render(<App />);
