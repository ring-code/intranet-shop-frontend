import React from 'react';
import logo from '../logo.svg';
import { Link } from 'react-router-dom';
import { Container, Navbar, Nav, Image } from 'react-bootstrap';


const Navigation = ({isLoggedIn, handleLogout, userEmail, cart }) => {
    return <Navbar bg="dark" variant="dark" expand="lg" className='nav'>
          
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
            
          </>
          :
          <>
          <Nav.Link as={Link} to="/login">Login</Nav.Link>
          <Nav.Link as={Link} to="/register">Registrierung</Nav.Link>
          </>
          }

          

        </Nav>

        <Nav className="ms-auto">
            {isLoggedIn ? (
              <>                
                <Nav.Link href="#" className="text-light navbar-email">{userEmail}</Nav.Link>
                {cart && cart.length > 0 && (
                  <Nav.Link as={Link} to="/cart">Warenkorb ({cart.length})</Nav.Link>
                )}
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