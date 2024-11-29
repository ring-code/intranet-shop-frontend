import React, { act } from 'react'; // Import act from react
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import '@testing-library/jest-dom';


jest.mock('./components/Navigation', () => ({
  isLoggedIn, handleLogout, userEmail
}) => (
  <nav>
    <button onClick={handleLogout}>Logout</button>
    {isLoggedIn && <span>Welcome {userEmail}</span>}
  </nav>
));


describe('App', () => {
  
  test('renders home page by default', () => {
    render(
      <Router>
        <App />
      </Router>
    );
    expect(screen.getByText(/Herzlich willkommen/)).toBeInTheDocument();
  });


  test('handles logout correctly', async () => {
    localStorage.setItem('isLoggedIn', 'true');
    render(
      <Router>
        <App />
      </Router>
    );

    fireEvent.click(screen.getByText((content, element) => element.tagName.toLowerCase() === 'button' && content.includes('Logout')));

    await waitFor(() => {
      expect(screen.queryByText((content, element) => element.tagName.toLowerCase() === 'span' && content.includes('Welcome'))).not.toBeInTheDocument();
    });
  });
});
