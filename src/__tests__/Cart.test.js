import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Cart from '../components/Cart';
import { useCart } from '../components/CartContext';
import { useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';
import React from 'react';

// Mocking the CartContext and useNavigate hook
jest.mock('../components/CartContext', () => ({
  useCart: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Cart', () => {
  const mockNavigate = jest.fn();
  const mockSetCart = jest.fn();
  const mockCart = [
    {
      product_id: '1',
      title: 'Product 1',
      description: 'This is product 1',
      price: 20,
      quantity: 2,
      image_url: 'product1.jpg',
    },
  ];

  beforeEach(() => {
    useCart.mockReturnValue({ cart: mockCart, setCart: mockSetCart });
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('should display cart items', () => {
    render(<Cart />);
  
    // Check if product title is displayed
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); 
    
    // Handle multiple price elements and assert the first one (or adjust based on your needs)
    const priceElements = screen.getAllByText('40.00 €');
    expect(priceElements[0]).toBeInTheDocument(); 
  });

  it('should increase the quantity of an item in the cart', () => {
    render(<Cart />);

    const increaseButton = screen.getByText('+');
    fireEvent.click(increaseButton);

    // Expect the quantity to increase to 3
    expect(mockSetCart).toHaveBeenCalledWith([
      {
        ...mockCart[0],
        quantity: 3,
      },
    ]);
  });

  it('should decrease the quantity of an item in the cart', () => {
    render(<Cart />);
    
    const decreaseButton = screen.getByRole('button', { name: /-$/ });
    fireEvent.click(decreaseButton); // Simulate decrease action
    
    expect(mockSetCart).toHaveBeenCalledWith([
      { ...mockCart[0], quantity: 2 }  // Check if quantity is updated correctly
    ]);
  });

  it('should remove an item from the cart', () => {
    render(<Cart />);

    const removeButton = screen.getByText('Aus Warenkorb entfernen');
    fireEvent.click(removeButton);

    // Expect the cart to be empty after removal
    expect(mockSetCart).toHaveBeenCalledWith([]);
  });

  it('should display success message when order is placed successfully', async () => {
    // Mock successful API response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ orderId: 123 }),
      })
    );

    render(<Cart />);

    const placeOrderButton = screen.getByText('Bestellung abschicken');
    fireEvent.click(placeOrderButton);

    // Check if success message is shown
    await waitFor(() => {
      expect(screen.getByText('Bestellung erfolgreich!')).toBeInTheDocument();
    });
  });

  it('should display error message when order fails', async () => {
    // Mock failed API response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );

    render(<Cart />);

    const placeOrderButton = screen.getByText('Bestellung abschicken');
    fireEvent.click(placeOrderButton);

    // Check if error message is shown
    await waitFor(() => {
      expect(screen.getByText('Bestellung fehlgeschlagen.')).toBeInTheDocument();
    });
  });

  it('should show a warning message if the cart is empty', () => {
    useCart.mockReturnValue({ cart: [], setCart: mockSetCart });

    render(<Cart />);

    // Check if the cart is empty and a warning is shown
    expect(screen.getByText('Ihr Warenkorb ist leer.')).toBeInTheDocument();
  });
});
