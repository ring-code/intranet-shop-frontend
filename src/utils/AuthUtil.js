/**
 * @module AuthUtil
 * @description Handles user login by sending a POST request with email and password, then processes the response.
 * If successful, stores the user's token, ID, email, and admin status in localStorage, 
 * sets login state, and navigates to the products page. If login fails, an error is displayed.
 *
 * @param {Object} params - The parameters required for logging in a user.
 * @param {string} params.email - The user's email address.
 * @param {string} params.password - The user's password.
 * @param {function} params.setIsLoggedIn - Function to update the login state.
 * @param {function} params.setIsAdmin - Function to update the user's admin status.
 * @param {function} params.setSuccess - Function to set the success message.
 * @param {function} params.setError - Function to set the error message.
 * @param {function} params.navigate - Function to navigate to a different page (e.g., after successful login).
 *
 * @returns {Promise<void>} Resolves after attempting login. If successful, it sets the login state and navigates.
 * @throws {Error} Throws an error if the login process encounters an issue (network error, invalid response).
 */
export const loginUser = async ({ email, password, setIsLoggedIn, setIsAdmin, setSuccess, setError, navigate }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const isAdminBool = data.isAdmin === 1 ? 'true' : 'false';
  
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userEmail', data.userEmail);
        localStorage.setItem('isAdmin', isAdminBool);
        localStorage.setItem('cart', '[]');
        localStorage.setItem('isLoggedIn', 'true');
  
        setIsLoggedIn(true);
        setIsAdmin(data.isAdmin);
        setSuccess('Erfolgreich eingeloggt! Sie werden zum Shop weitergeleitet.');
        setTimeout(() => {
          navigate('/products');
        }, 2000);
      } else {
        setError(data.error || 'Login fehlgeschlagen.');
      }
    } catch (error) {
      console.error('Fehler beim Login:', error);
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    }
  };