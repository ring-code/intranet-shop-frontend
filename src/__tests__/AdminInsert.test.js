import React, { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminProductInsert from '../components/AdminProductInsert';
import { CartProvider } from '../components/CartContext'; // Assuming you have a CartContext



// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      message: 'Product inserted successfully',
    }),
  })
);

describe('AdminProductInsert Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('token', 'mock-token'); // Set the token for authorization
  });

  test('renders the product insert form', () => {
    render(
      <MemoryRouter>
        <CartProvider>
          <AdminProductInsert />
        </CartProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Neues Produkt hinzufügen')).toBeInTheDocument();
    expect(screen.getByText('Bild')).toBeInTheDocument();
    expect(screen.getByText('Titel')).toBeInTheDocument();
    expect(screen.getByText('Preis (€)')).toBeInTheDocument();
    expect(screen.getByText('Beschreibung')).toBeInTheDocument();
    expect(screen.getByText('Speichern')).toBeInTheDocument();
  });

  test('handles form validation errors', async () => {
    render(
      <MemoryRouter>
        <CartProvider>
          <AdminProductInsert />
        </CartProvider>
      </MemoryRouter>
    );

    act(() => {
      fireEvent.click(screen.getByText('Speichern'));
    });

    await waitFor(() => {
      expect(screen.getByText(/Alle Felder/)).toBeInTheDocument();
    });
  });

  test('submits the form and handles successful product insertion', async () => {
    // Render the component wrapped in context and router
    render(
      <MemoryRouter>
        <CartProvider>
          <AdminProductInsert />
        </CartProvider>
      </MemoryRouter>
    );
  
    // Simulate file input change for the image
    fireEvent.change(screen.getByText('Bild').closest('tr').querySelector('input[type="file"]'), {
      target: { files: [new File([], 'new-image.jpg')] },
    });
  
    // Simulate text input changes for 'Titel', 'Preis (€)', and 'Beschreibung'
    fireEvent.change(screen.getByText('Titel').closest('tr').querySelector('input[type="text"]'), {
      target: { value: 'New Product' },
    });
  
    fireEvent.change(screen.getByText('Preis (€)').closest('tr').querySelector('input[type="number"]'), {
      target: { value: '10' },
    });
  
    fireEvent.change(screen.getByText('Beschreibung').closest('tr').querySelector('textarea'), {
      target: { value: 'Description of the new product' },
    });
  
    // Simulate clicking on the Save button
    act(() => {
      fireEvent.click(screen.getByText('Speichern'));
    });
  
    // Check if fetch is called with the correct parameters
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.REACT_APP_SERVER_URL}/admin/insert`,
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Authorization': `Bearer mock-token`, // Adjust if your token differs
          },
          body: expect.any(FormData),  // Check that a FormData object is sent
        })
      );
    });
  
    // Check if success message is displayed
    await waitFor(() => {
      expect(screen.getByText('Produkt erfolgreich hinzugefügt!')).toBeInTheDocument();
    });
  });

  

  test('handles product insertion errors', async () => {
    // Simulate a failed API request by making fetch reject
    global.fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('Insertion failed'))
    );
  
    // Render the component wrapped in context and router
    render(
      <MemoryRouter>
        <CartProvider>
          <AdminProductInsert />
        </CartProvider>
      </MemoryRouter>
    );
  
    // Simulate file input change for the image
    fireEvent.change(screen.getByText('Bild').closest('tr').querySelector('input[type="file"]'), {
      target: { files: [new File([], 'new-image.jpg')] },
    });
  
    // Simulate text input changes for 'Titel', 'Preis (€)', and 'Beschreibung'
    fireEvent.change(screen.getByText('Titel').closest('tr').querySelector('input[type="text"]'), {
      target: { value: 'New Product' },
    });
  
    fireEvent.change(screen.getByText('Preis (€)').closest('tr').querySelector('input[type="number"]'), {
      target: { value: '10' },
    });
  
    fireEvent.change(screen.getByText('Beschreibung').closest('tr').querySelector('textarea'), {
      target: { value: 'Description of the new product' },
    });
  
    // Simulate clicking on the Save button
    act(() => {
      fireEvent.click(screen.getByText('Speichern'));
    });
  
    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Fehler/)).toBeInTheDocument();
    });
  });
});
