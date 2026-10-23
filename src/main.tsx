import {createRoot} from 'react-dom/client';
import { AccountGate } from './components/AccountGate';
import './index.css';

createRoot(document.getElementById('root')!).render(<AccountGate />);

if ('serviceWorker' in navigator) window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').catch(() => {}); });
