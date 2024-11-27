import React, { useState, useEffect } from 'react';
import logo from '../logo.svg';
import { Link } from 'react-router-dom';
import { Container, Navbar, Nav, Image,  Dropdown } from 'react-bootstrap';

import { useCart } from './CartContext';

const Navigation = ({isLoggedIn, isAdmin, handleLogout}) => {
    const prevIsLoggedIn = React.useRef(isLoggedIn);
    const { cart, resetCart } = useCart();
    const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || '');

    useEffect(() => {
      // Sync the userEmail from localStorage whenever the component mounts
      const email = localStorage.getItem('userEmail');
      setUserEmail(email || '');
    }, [isLoggedIn]); // Re-run this effect when the login status changes
    
    useEffect(() => {
      // Detect logout by comparing current and previous login state
      if (!isLoggedIn && prevIsLoggedIn.current) {
        resetCart(); // Clear the cart only on logout
      }
      prevIsLoggedIn.current = isLoggedIn;
    }, [isLoggedIn, resetCart]); // Runs whenever isLoggedIn changes
    
    
    const totalItemsInCart = cart.reduce((acc, item) => acc + item.quantity, 0);

    
    return <Navbar bg="dark" variant="dark" expand="lg" className='navbar-fixed'>
          
    <Container>
      
      <Navbar.Brand as={Link} to="/">
        <Image src={logo} width="50" />
      </Navbar.Brand>
      
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      
      <Navbar.Collapse id="basic-navbar-nav">
        
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/">Home</Nav.Link>
          
          {isLoggedIn ?
          <>
            <Nav.Link as={Link} to="/products">Shop</Nav.Link>
            {cart && cart.length > 0 && (
                <Nav.Link as={Link} to="/cart">Warenkorb ({totalItemsInCart})</Nav.Link>
            )}
            <Nav.Link as={Link} to="/orders">Bestellungen</Nav.Link>
          </>
          :
          <>
          <Nav.Link as={Link} to="/login">Login</Nav.Link>
          <Nav.Link as={Link} to="/register">Registrierung</Nav.Link>
          </>
          }

          {isLoggedIn && isAdmin && (
            <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-custom-components">
              Administration
            </Dropdown.Toggle>
  
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/admin/products">Produkte verwalten</Dropdown.Item>
              <Dropdown.Item as={Link} to="/admin/insert">Produkt hinzufügen</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          )}

        

          

        </Nav>

        <Nav className="ms-auto">
            {isLoggedIn ? (
              <>                
                <Nav.Link href="#" className="text-light navbar-email">{userEmail}</Nav.Link>
                
                
                
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              
              </>
            ) : (
              <></>
            )}
          </Nav>


        
      </Navbar.Collapse>
    </Container>
  </Navbar>
  
};

export default Navigation;