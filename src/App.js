import React, { useState, useEffect } from 'react';
import './App.css';

import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import Home from './components/Home';
import RegistrationForm from './components/Register';
import Login from './components/Login';
import ProductList from './components/ProductList';
import Navigation from './components/Navigation';
import Cart from './components/Cart';
import ProductDetail from './components/ProductDetail';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [userId, setUserId] = useState(null);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const handleToggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  useEffect(() => {
    
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    const storedUserEmail = localStorage.getItem('userEmail');
    const storedCart = localStorage.getItem('cart');


    if (token && storedUserId) {
      setIsLoggedIn(true);
      setUserId(storedUserId);
      setUserEmail(storedUserEmail)
    }
  
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
        setCart([]); // In case of invalid data in localStorage
      }
    }
  
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    // remove cart?
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    
    <div className="App">
      <Navigation 
        isLoggedIn={isLoggedIn} 
        handleLogout={handleLogout} 
        userEmail={userEmail}
        cart={cart}
      />

      <Container className="mt-4">
        <Routes>
          <Route path ="/" element={<Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>} />
          <Route path ="/register" element={<RegistrationForm isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>} />
          <Route path ="/login" element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>} />
          <Route path ="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path ="/cart" element={<Cart />} />

         
        </Routes>
        
      </Container>
    </div>
  );
}

export default App;
