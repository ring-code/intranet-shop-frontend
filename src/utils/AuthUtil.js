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