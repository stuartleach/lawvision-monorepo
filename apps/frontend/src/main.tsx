import { createRoot } from 'react-dom/client';
import App from './App';
// import '@react-sigma/core/lib/react-sigma.min.css';
import './index.css'; // Ensure this line is present
import React from 'react';


const container = document.getElementById('root');
const root = createRoot(container!);  // Non-null assertion operator to assert that container is not null
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
