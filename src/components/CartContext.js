import React, { createContext, useState, useContext, useEffect } from 'react';

// Create context
const CartContext = createContext();


export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const token = localStorage.getItem('token'); // Read directly in effect

  // Load cart on initial mount
  useEffect(() => {
    if (token) {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } else {
      setCart([]); // Clear cart for logged-out users
    }
  }, [token]); // Re-run if the token changes

  // Save cart whenever it changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (token) {
        localStorage.setItem('cart', JSON.stringify(cart));
      } else {
        localStorage.removeItem('cart');
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [cart, token]);

  const resetCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, setCart, resetCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => useContext(CartContext);