import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../components/Login';


// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      token: 'mock-token',
      userId: 'mock-userId',
      userEmail: 'mock-userEmail',
      isAdmin: 1,
    }),
  })
);

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the login form', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText('Anmeldung')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('E-Mail-Adresse')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Passwort eingeben')).toBeInTheDocument();
    expect(screen.getByText('Anmelden')).toBeInTheDocument();
  });

  test('submits the form and handles successful login', async () => {
    const setIsLoggedIn = jest.fn();
    const setIsAdmin = jest.fn();

    render(
      <MemoryRouter>
        <Login isLoggedIn={false} setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('E-Mail-Adresse'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Passwort eingeben'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Anmelden'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.REACT_APP_SERVER_URL}/login`,
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
        })
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Erfolgreich eingeloggt! Sie werden zum Shop weitergeleitet.')).toBeInTheDocument();
    });

    expect(setIsLoggedIn).toHaveBeenCalledWith(true);
    expect(setIsAdmin).toHaveBeenCalledWith(1);
  });

  test('handles login error', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Invalid email or password' }),
      })
    );

    const setIsLoggedIn = jest.fn();
    const setIsAdmin = jest.fn();

    render(
      <MemoryRouter>
        <Login isLoggedIn={false} setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('E-Mail-Adresse'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Passwort eingeben'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByText('Anmelden'));

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });
  });
});