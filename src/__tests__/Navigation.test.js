import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import CartIcon from '../components/CartIcon';
import Navigation from '../components/Navigation';
import { useCart, CartProvider } from '../components/CartContext'; // Import the custom hook

import '@testing-library/jest-dom';

jest.mock('../logo.svg', () => 'logo.svg');

jest.mock('../components/CartContext', () => ({
  useCart: jest.fn(),
  CartProvider: ({ children, value }) => (
      <div value={value}>{children}</div>
  ),
}));

// Helper function to render Navigation with cart data
const renderNavigationWithCart = (cartItems, isLoggedIn = true, isAdmin = false) => {
  useCart.mockReturnValue({ cart: cartItems, resetCart: jest.fn() }); // Mock cart context
  render(
    <Router>
      <Navigation isLoggedIn={isLoggedIn} isAdmin={isAdmin} handleLogout={jest.fn()} />
    </Router>
  );
};


describe('Navigation', () => {
  const mockLogout = jest.fn();

  // Helper function to render the Navigation with Router
  const renderNavigation = (isLoggedIn, isAdmin, cart = []) => {
    useCart.mockReturnValue({ cart, resetCart: jest.fn() }); // Mock cart context
    render(
      <Router>
        <Navigation isLoggedIn={isLoggedIn} isAdmin={isAdmin} handleLogout={mockLogout} />
      </Router>
    );
  };

  test('renders Shop and Bestellungen links when logged in', () => {
    renderNavigation(true, false); // User is logged in, not admin
    
    // Check if Shop and Bestellungen links are present
    expect(screen.getByText('Shop')).toBeInTheDocument();
    expect(screen.getByText('Bestellungen')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.queryByText('Registrierung')).not.toBeInTheDocument();
  });

  test('shows Cart Icon with item count when logged in', () => {
    const mockCart = [{ quantity: 2 }, { quantity: 1 }]; // Cart has 3 items
    renderNavigationWithCart(mockCart, true); // User is logged in
    
    // Use the test id to select the CartIcon
    const cartIcon = screen.getByTestId('cart-icon');
    expect(cartIcon).toBeInTheDocument(); // Ensure CartIcon is rendered
    expect(cartIcon).toHaveTextContent('3'); // Check if the correct item count is displayed
  });


  test('shows Admin links when the user is an admin', () => {
    renderNavigation(true, true); // User is logged in and is an admin
    
    // Check for the "Administration" dropdown and its items
    expect(screen.getByText('Administration')).toBeInTheDocument();
  });

  test('calls handleLogout when Logout is clicked', () => {
    renderNavigation(true, false); // User is logged in

    // Click the Logout button
    fireEvent.click(screen.getByText('Logout'));

    // Verify that handleLogout was called
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  test('displays Login and Registrierung links when logged out', () => {
    renderNavigation(false, false); // User is not logged in
    
    // Check that Login and Registration links are rendered
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Registrierung')).toBeInTheDocument();
    expect(screen.queryByText('Shop')).not.toBeInTheDocument();
  });

  test('displays the user email when logged in', () => {
    const userEmail = 'testuser@example.com';
    localStorage.setItem('userEmail', userEmail); // Set the user email in localStorage
    renderNavigation(true, false); // User is logged in
    
    // Check if the user email is displayed in the navigation
    expect(screen.getByText(userEmail)).toBeInTheDocument();
  });

  test('does not show Cart Icon when cart is empty', () => {
    renderNavigation(true, false, []); // Cart is empty
    
    // Check if CartIcon is not rendered
    expect(screen.queryByText('CartIcon')).not.toBeInTheDocument();
  });
});
