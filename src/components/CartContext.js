import React, { createContext, useState, useContext, useEffect } from 'react';

// Create context
const CartContext = createContext();

/**
 * @module CartContext
 * @description CartProvider component that manages the shopping cart state and provides context to its children.
 * It handles adding items to the cart, saving the cart to localStorage, and resetting the cart.
 * Also loads the cart from localStorage on initial mount.
 *
 * 
 * @param {Object} props - The props passed to the provider component.
 * @param {React.ReactNode} props.children - The children components that will have access to the cart context.
 */
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]); // State to store the items in the cart
  const token = localStorage.getItem('token'); // Read directly in effect to get the user's token

  /**
   * Adds an item to the cart. If the item already exists in the cart, it increases the quantity.
   * If it's a new item, it adds it to the cart.
   * @function handleAddToCart
   * @param {number} productId - The unique identifier for the product.
   * @param {number} price - The price of the product.
   * @param {string} title - The title/name of the product.
   * @param {string} description - A description of the product.
   * @param {string} image_url - The URL of the product image.
   */
  const handleAddToCart = (productId, price, title, description, image_url) => {
    const newCart = [...cart];
    const itemIndex = newCart.findIndex((item) => item.product_id === productId);

    if (itemIndex >= 0) {
      newCart[itemIndex].quantity += 1; // Increase quantity if already in the cart
    } else {
      newCart.push({
        product_id: productId,
        quantity: 1,
        price,
        title,
        description,
        image_url
      });
    }

    setCart(newCart); // Update the cart state
    localStorage.setItem('cart', JSON.stringify(newCart)); // Save the updated cart to localStorage
  };

  // Load cart on initial mount (if a user is logged in)
  useEffect(() => {
    if (token) {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart)); // Load stored cart from localStorage
      }
    } else {
      setCart([]); // Clear cart for logged-out users
    }
  }, [token]); // Re-run if the token changes (e.g., user logs in/out)

  /**
   * Saves the cart to localStorage every time it changes. If the user is logged out, the cart is removed from localStorage.
   * This operation is debounced by 500ms to avoid excessive writes to localStorage.
   */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (token) {
        localStorage.setItem('cart', JSON.stringify(cart)); // Save to localStorage if user is logged in
      } else {
        localStorage.removeItem('cart'); // Remove cart if user is logged out
      }
    }, 500);

    return () => clearTimeout(timeoutId); // Clean up the timeout when the component unmounts or when `cart` or `token` changes
  }, [cart, token]);

  /**
   * @function resetCart
   * Resets the cart to an empty array.
   */
  const resetCart = () => {
    setCart([]); 
  };

  return (
    <CartContext.Provider value={{ cart, setCart, resetCart, handleAddToCart }}>
      {children} {/* Render children with access to the cart context */}
    </CartContext.Provider>
  );
};

/**
 * Custom hook to access the CartContext.
 * @returns {Object} The context value containing cart data and cart management functions.
 */
export const useCart = () => useContext(CartContext);
