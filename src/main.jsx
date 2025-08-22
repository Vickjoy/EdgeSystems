import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ShopperAuthProvider } from './context/ShopperAuthContext';
import './index.css';

const root = createRoot(document.getElementById('root'));

root.render(
  <Router>
    <AuthProvider>
      <ShopperAuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </ShopperAuthProvider>
    </AuthProvider>
  </Router>
);
