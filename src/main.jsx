import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import './index.css';

const root = createRoot(document.getElementById('root'));

root.render(
  <Router>
    <CartProvider>
      <App />
    </CartProvider>
  </Router>
);
