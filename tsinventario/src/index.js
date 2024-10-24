import React from 'react';
import { createRoot } from 'react-dom/client'; // Importar createRoot desde react-dom/client
import App from './frontend/App';

// Seleccionar el contenedor raíz en el DOM
const rootElement = document.getElementById('root');

// Crear la raíz usando createRoot y renderizar el componente App
const root = createRoot(rootElement);
root.render(<App />);
