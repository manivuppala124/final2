import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { MainContextProvider } from './context/MainContext';
import { AuthProvider } from './context/AuthContent'; // Import AuthProvider

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <MainContextProvider>
    <AuthProvider> {/* Wrap App with AuthProvider */}
      <React.StrictMode>
        <Router>
          <App />
        </Router>
      </React.StrictMode>
    </AuthProvider>
  </MainContextProvider>
);
