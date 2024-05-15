import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '@react-sigma/core/lib/react-sigma.min.css';

const container = document.getElementById('root');
const root = createRoot(container!);  // Non-null assertion operator to assert that container is not null
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
