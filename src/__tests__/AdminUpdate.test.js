import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminProductDetails from '../components/AdminProductUpdate';
import { CartProvider } from '../components/CartContext'; 

// Mock global fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      message: 'Product updated successfully',
    }),
  })
);

describe('AdminProductUpdate Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('token', 'mock-token'); // Set the token for authorization
  });

  test('renders the product update form', () => {
    const product = {
      product_id: 1,
      title: 'Test Product',
      price: '20',
      description: 'A sample product for testing.',
      image_url: 'path/to/image.jpg',
    };

    render(
      <MemoryRouter initialEntries={[{ pathname: '/admin/product-details', state: { product } }]}>
        <CartProvider>
          <AdminProductDetails />
        </CartProvider>
      </MemoryRouter>
    );

    // Verify the product details are rendered correctly
    expect(screen.getByText('Produkt editieren: #1, Test Product')).toBeInTheDocument();
    expect(screen.getByText('Bild')).toBeInTheDocument();
    expect(screen.getByText('Titel')).toBeInTheDocument();
    expect(screen.getByText('Preis (€)')).toBeInTheDocument();
    expect(screen.getByText('Beschreibung')).toBeInTheDocument();
    expect(screen.getByText('Speichern')).toBeInTheDocument();
    expect(screen.getByText('Produkt löschen')).toBeInTheDocument();

    // Verify that the form inputs are populated with the existing product data
    expect(screen.getByDisplayValue('Test Product')).toBeInTheDocument();
    expect(screen.getByDisplayValue('20')).toBeInTheDocument();
    expect(screen.getByText('A sample product for testing.')).toBeInTheDocument();
  });

  test('submits the form and handles successful product update', async () => {
    const product = {
      product_id: 1,
      title: 'Test Product',
      price: '20',
      description: 'A sample product for testing.',
      image_url: 'path/to/image.jpg',
    };

    render(
      <MemoryRouter initialEntries={[{ pathname: '/admin/product-details', state: { product } }]}>
        <CartProvider>
          <AdminProductDetails />
        </CartProvider>
      </MemoryRouter>
    );

    // Simulate file input change for the image
    fireEvent.change(screen.getByText('Bild').closest('tr').querySelector('input[type="file"]'), {
      target: { files: [new File([], 'updated-image.jpg')] },
    });

    // Simulate text input changes for 'Titel', 'Preis (€)', and 'Beschreibung'
    fireEvent.change(screen.getByText('Titel').closest('tr').querySelector('input[type="text"]'), {
      target: { value: 'Updated Product' },
    });

    fireEvent.change(screen.getByText('Preis (€)').closest('tr').querySelector('input[type="number"]'), {
      target: { value: '25' },
    });

    fireEvent.change(screen.getByText('Beschreibung').closest('tr').querySelector('textarea'), {
      target: { value: 'Updated description of the product' },
    });

    // Simulate clicking on the Save button
    act(() => {
      fireEvent.click(screen.getByText('Speichern'));
    });

    // Check if fetch is called with the correct parameters
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.REACT_APP_SERVER_URL}/admin/update/1`,
        expect.objectContaining({
          method: 'PUT',
          headers: {
            'Authorization': `Bearer mock-token`, // Adjust if your token differs
          },
          body: expect.any(FormData),  // Check that a FormData object is sent
        })
      );
    });

    // Check if success message is displayed
    await waitFor(() => {
      expect(screen.getByText('Produkt erfolgreich aktualisiert!')).toBeInTheDocument();
    });
  });

  test('handles product update errors', async () => {
    // Simulate a failed API request by making fetch reject
    global.fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('Update failed'))
    );

    const product = {
      product_id: 1,
      title: 'Test Product',
      price: '20',
      description: 'A sample product for testing.',
      image_url: 'path/to/image.jpg',
    };

    render(
      <MemoryRouter initialEntries={[{ pathname: '/admin/product-details', state: { product } }]}>
        <CartProvider>
          <AdminProductDetails />
        </CartProvider>
      </MemoryRouter>
    );

    // Simulate file input change for the image
    fireEvent.change(screen.getByText('Bild').closest('tr').querySelector('input[type="file"]'), {
      target: { files: [new File([], 'updated-image.jpg')] },
    });

    // Simulate text input changes for 'Titel', 'Preis (€)', and 'Beschreibung'
    fireEvent.change(screen.getByText('Titel').closest('tr').querySelector('input[type="text"]'), {
      target: { value: 'Updated Product' },
    });

    fireEvent.change(screen.getByText('Preis (€)').closest('tr').querySelector('input[type="number"]'), {
      target: { value: '25' },
    });

    fireEvent.change(screen.getByText('Beschreibung').closest('tr').querySelector('textarea'), {
      target: { value: 'Updated description of the product' },
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

  test('handles product deletion', async () => {
    const product = {
      product_id: 1,
      title: 'Test Product',
      price: '20',
      description: 'A sample product for testing.',
      image_url: 'path/to/image.jpg',
    };

    // Simulate successful delete API response
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: true })
    );

    render(
      <MemoryRouter initialEntries={[{ pathname: '/admin/product-details', state: { product } }]}>
        <CartProvider>
          <AdminProductDetails />
        </CartProvider>
      </MemoryRouter>
    );

    // Confirm deletion by clicking delete button
    fireEvent.click(screen.getByText('Produkt löschen'));

    // Click "Ja, löschen" in the confirmation dialog
    act(() => {
      fireEvent.click(screen.getByText('Ja, löschen'));
    });

    // Simulate API call for product deletion
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.REACT_APP_SERVER_URL}/admin/delete/1`,
        expect.objectContaining({
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer mock-token',
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            image_url: 'path/to/image.jpg',
          }),
        })
      );
    });

    // Check for success message and navigation
    await waitFor(() => {
      expect(screen.getByText('Produkt erfolgreich gelöscht!')).toBeInTheDocument();
    });
  });
});
