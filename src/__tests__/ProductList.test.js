import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductList from '../components/ProductList';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import '@testing-library/jest-dom';
import React from 'react';

// Mocking the CartContext and useNavigate hook
jest.mock('../components/CartContext', () => ({
  useCart: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('ProductList', () => {
  const mockNavigate = jest.fn();
  const mockAddToCart = jest.fn();

  beforeEach(() => {
    useCart.mockReturnValue({ handleAddToCart: mockAddToCart });
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('should show an error message if there is an error loading products', async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Error fetching products'))
    );

    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText('Ein Fehler ist aufgetreten.')).toBeInTheDocument();
    });
  });

  it('should display a list of products after successful fetch', async () => {
    const mockProducts = [
      {
        product_id: '1',
        title: 'Product 1',
        description: 'Description 1',
        price: 10,
        image_url: 'image1.jpg',
      },
      {
        product_id: '2',
        title: 'Product 2',
        description: 'Description 2',
        price: 20,
        image_url: 'image2.jpg',
      },
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProducts),
      })
    );

    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
    });
  });

  it('should navigate to the product details page when a product card is clicked', async () => {
    const mockProducts = [
      {
        product_id: '1',
        title: 'Product 1',
        description: 'Description 1',
        price: 10,
        image_url: 'image1.jpg',
      },
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProducts),
      })
    );

    render(<ProductList />);

    await waitFor(() => {
      const productCard = screen.getByText('Product 1');
      fireEvent.click(productCard);
    });

    // Assert that navigate was called
    expect(mockNavigate).toHaveBeenCalledWith('/products/1', { state: { product: mockProducts[0] } });
  });

  it('should open a modal when an image is clicked', async () => {
    const mockProducts = [
      {
        product_id: '1',
        title: 'Product 1',
        description: 'Description 1',
        price: 10,
        image_url: 'image1.jpg',
      },
    ];
  
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProducts),
      })
    );
  
    render(<ProductList />);
  
    await waitFor(() => {
      const productImage = screen.getByRole('img');
      fireEvent.click(productImage);
    });
  
    // Assert that the modal is opened
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  
    // Assert that 'Product 1' is in the modal twice
    const productTitleElements = screen.getAllByText('Product 1');
    expect(productTitleElements).toHaveLength(2);  // Check that 'Product 1' appears twice
  });

  it('should show a warning message if no products are found', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText('Keine Produkte gefunden.')).toBeInTheDocument();
    });
  });

  it('should call handleAddToCart when the "In den Warenkorb" button is clicked', async () => {
    const mockProducts = [
      {
        product_id: '1',
        title: 'Product 1',
        description: 'Description 1',
        price: 10,
        image_url: 'image1.jpg',
      },
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProducts),
      })
    );

    render(<ProductList />);

    await waitFor(() => {
      const addToCartButton = screen.getByText('In den Warenkorb');
      fireEvent.click(addToCartButton);
    });

    // Assert that handleAddToCart was called with the correct arguments
    expect(mockAddToCart).toHaveBeenCalledWith(
      '1', // product_id
      10,  // price
      'Product 1', // title
      'Description 1', // description
      'image1.jpg' // image_url
    );
  });
});
