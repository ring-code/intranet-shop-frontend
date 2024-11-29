import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Orders from '../components/Orders';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mocking localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
};
global.localStorage = mockLocalStorage;

// Mocking fetch
global.fetch = jest.fn();

// Helper function to render Orders component with Router
const renderOrders = () => {
  render(
    <Router>
      <Orders />
    </Router>
  );
};

describe('Orders Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockLocalStorage.getItem.mockReset();
    fetch.mockReset();
  });

  

  test('displays an error message when fetch fails', async () => {
    mockLocalStorage.getItem.mockReturnValue('test@example.com'); // Mocking userEmail
    fetch.mockRejectedValueOnce(new Error('Network Error')); // Mock fetch rejection
    
    renderOrders();
    
    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Ein Fehler ist aufgetreten/)).toBeInTheDocument();
    });
  });

  test('displays a warning when no orders are found', async () => {
    mockLocalStorage.getItem.mockReturnValue('test@example.com'); // Mocking userEmail
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [], // Mock fetch with empty orders
    });
    
    renderOrders();
    
    // Wait for the "Keine Bestellungen gefunden" message to appear
    await waitFor(() => {
      expect(screen.getByText(/Keine Bestellungen gefunden/)).toBeInTheDocument();
    });
  });

  test('displays orders correctly when data is fetched successfully', async () => {
    mockLocalStorage.getItem.mockReturnValue('test@example.com'); // Mocking userEmail
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          order_id: '1',
          order_date: '2024-11-28T12:34:00',
          items: [
            {
              product_id: '101',
              title: 'Product 1',
              quantity: 2,
              price: '19.99',
            },
            {
              product_id: '102',
              title: 'Product 2',
              quantity: 1,
              price: '9.99',
            },
          ],
          total_amount: '49.97',
        },
      ],
    });

    renderOrders();
    
    // Wait for the orders to load
    await waitFor(() => {
      expect(screen.getByText(/Bestellung vom/)).toBeInTheDocument();
      expect(screen.getByText(/Gesamtbetrag:/)).toBeInTheDocument();
      expect(screen.getByText(/Product 1/)).toBeInTheDocument();
      expect(screen.getByText(/19.99€/)).toBeInTheDocument();
    });
  });
});
