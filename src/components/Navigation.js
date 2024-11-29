import React, { useState, useEffect } from 'react';
import logo from '../logo.svg';
import { Link } from 'react-router-dom';
import { Container, Navbar, Nav, Image, Dropdown } from 'react-bootstrap';
import { useCart } from './CartContext';
import CartIcon from './CartIcon'; 

/**
 * Navigation component handles the navigation bar and updates based on the user's login state.
 * It also synchronizes user information.
 * @module Navigation
 * @param {Object} props - The component props
 * @param {boolean} props.isLoggedIn - The user's login state
 * @param {boolean} props.isAdmin - The user's admin state
 * @param {Function} props.handleLogout - Function to handle user logout
 * @returns {JSX.Element} The navigation bar
 */
const Navigation = ({ isLoggedIn, isAdmin, handleLogout }) => {
  const prevIsLoggedIn = React.useRef(isLoggedIn); 
  const {resetCart } = useCart(); 
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || ''); 

  useEffect(() => {
    const email = localStorage.getItem('userEmail'); 
    setUserEmail(email || ''); 
  }, [isLoggedIn]); 

  useEffect(() => {
    if (!isLoggedIn && prevIsLoggedIn.current) {
      resetCart(); // Clear the cart if the user logs out
    }
    prevIsLoggedIn.current = isLoggedIn; // Update the previous login state
  }, [isLoggedIn, resetCart]); // Runs when isLoggedIn or resetCart changes


  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="navbar-fixed">
      <Container>
        {/* Brand Logo */}
        <Navbar.Brand as={Link} to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <Image src={logo} width="50" />
        </Navbar.Brand>
  
        {/* Navbar Toggle */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
  
        {/* Navbar Links */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto align-items-center">
            {isLoggedIn ? (
              <>
                <Nav.Link as={Link} to="/products">Shop</Nav.Link>
  
                {/* Cart Icon with Fixed Alignment */}
                <Nav.Link as={Link} to="/cart" style={{ position: 'relative', minWidth: '50px', display: 'flex', alignItems: 'center' }}>
                  <CartIcon />
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Registrierung</Nav.Link>
              </>
            )}
          </Nav>
  
          <Nav className="ms-auto align-items-center">
            {isLoggedIn ? (
              <>
                {/* Admin Dropdown */}
                {isAdmin && (
                  <Dropdown>
                    <Dropdown.Toggle id="dropdown-custom-components" style={{ display: 'flex', alignItems: 'center' }}>
                      Administration
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item as={Link} to="/admin/products">Produkte verwalten</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/admin/insert">Produkt hinzufügen</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
  
                {/* User Email */}
                <Nav.Link href="#" className="text-light navbar-email" style={{ display: 'flex', alignItems: 'center' }}>
                  {userEmail}
                </Nav.Link>
  
                {/* Orders Link */}
                <Nav.Link as={Link} to="/orders" style={{ display: 'flex', alignItems: 'center' }}>
                  Bestellungen
                </Nav.Link>
  
                {/* Logout Link */}
                <Nav.Link onClick={handleLogout} style={{ display: 'flex', alignItems: 'center' }}>
                  Logout
                </Nav.Link>
              </>
            ) : (
              <></>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
  
};

export default Navigation;
