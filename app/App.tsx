import React from 'react';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import CartScreen from './cart';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <CartScreen />
      </CartProvider>
    </AuthProvider>
  );
} 