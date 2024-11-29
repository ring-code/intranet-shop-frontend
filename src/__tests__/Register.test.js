import React, { act } from 'react'; // Import act from react
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RegistrationForm from '../components/Register';

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      message: 'Registration successful',
    }),
  })
);

describe('RegistrationForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the registration form', () => {
    render(
      <MemoryRouter>
        <RegistrationForm />
      </MemoryRouter>
    );

    expect(screen.getByText('Registrierung')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('E-Mail-Adresse')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Passwort')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Passwort bestätigen')).toBeInTheDocument();
    expect(screen.getByText('Registrieren')).toBeInTheDocument();
  });

  test('submits the form and handles successful registration', async () => {
    render(
      <MemoryRouter>
        <RegistrationForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('E-Mail-Adresse'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Passwort'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Passwort bestätigen'), { target: { value: 'password123' } });

    act(() => {
      fireEvent.click(screen.getByText('Registrieren'));
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.REACT_APP_SERVER_URL}/register`,
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123',
          }),
        })
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/Registrierung erfolgreich!/)).toBeInTheDocument();
    });
  });

  test('handles password mismatch error', async () => {
    render(
      <MemoryRouter>
        <RegistrationForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('E-Mail-Adresse'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Passwort'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Passwort bestätigen'), { target: { value: 'wrongpassword' } });

    act(() => {
      fireEvent.click(screen.getByText('Registrieren'));
    });

    await waitFor(() => {
      expect(screen.getByText('Passwörter stimmen nicht überein!')).toBeInTheDocument();
    });
  });

  test('handles registration error', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Registration failed' }),
      })
    );

    render(
      <MemoryRouter>
        <RegistrationForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('E-Mail-Adresse'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Passwort'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Passwort bestätigen'), { target: { value: 'password123' } });

    act(() => {
      fireEvent.click(screen.getByText('Registrieren'));
    });

    await waitFor(() => {
      expect(screen.getByText('Registration failed')).toBeInTheDocument();
    });
  });
});
