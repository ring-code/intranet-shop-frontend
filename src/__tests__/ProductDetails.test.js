import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ProductDetails from '../components/ProductDetails';
import { useLocation } from 'react-router-dom';
import { CartProvider, useCart } from '../components/CartContext'; // Assuming you're using a CartContext provider for global state

// Mocking the useLocation hook to simulate state passed from the ProductList component
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));



describe('ProductDetails', () => {
  const mockProduct = {
    product_id: '1',
    title: 'Product 1',
    price: 20,
    description: 'Color: Red | Size: Medium',
    image_url: 'product1.jpg',
  };

  it('should display product details when product is available', () => {
    // Mock the state that would be passed by the ProductList component
    const mockUseLocation = require('react-router-dom').useLocation; // Get the mocked version of useLocation
    mockUseLocation.mockReturnValue({ state: { product: mockProduct } });

    render(
      <Router>
        <CartProvider>
          <ProductDetails />
        </CartProvider>
      </Router>
    );

    // Check if the product title, price, and image are displayed
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('20 €')).toBeInTheDocument();
    expect(screen.getByAltText('Product 1')).toBeInTheDocument(); // Assuming the alt text matches the product title

    // Check if product details (description) are rendered as key-value pairs in a table
    expect(screen.getByText('Color')).toBeInTheDocument();
    expect(screen.getByText('Red')).toBeInTheDocument();
    expect(screen.getByText('Size')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();

    // Check if the "Add to Cart" button is rendered
    const addToCartButton = screen.getByText('In den Warenkorb');
    expect(addToCartButton).toBeInTheDocument();
  });

  it('should display an error message if no product is found', () => {
    // Simulate the case where no product is passed in the state
    const mockUseLocation = require('react-router-dom').useLocation; // Get the mocked version of useLocation
    mockUseLocation.mockReturnValue({ state: {} });

    render(
      <Router>
        <CartProvider>
          <ProductDetails />
        </CartProvider>
      </Router>
    );

    // Check if the error message is displayed
    expect(screen.getByText('Produkt nicht gefunden.')).toBeInTheDocument();
  });

  it('should call handleAddToCart when the "In den Warenkorb" button is clicked', () => {
    // Mock useLocation
    useLocation.mockReturnValue({ state: { product: mockProduct } });
  
    // Spy on useCart to mock handleAddToCart
    const mockHandleAddToCart = jest.fn();
    jest.spyOn(require('../components/CartContext'), 'useCart').mockReturnValue({
      handleAddToCart: mockHandleAddToCart,
    });
  
    render(
      <Router>
        <CartProvider>
          <ProductDetails />
        </CartProvider>
      </Router>
    );
  
    // Simulate clicking the "In den Warenkorb" button
    const addToCartButton = screen.getByText('In den Warenkorb');
    fireEvent.click(addToCartButton);
  
    // Check if handleAddToCart was called
    expect(mockHandleAddToCart).toHaveBeenCalledWith(
      mockProduct.product_id,
      mockProduct.price,
      mockProduct.title,
      mockProduct.description,
      mockProduct.image_url
    );
  });
});
