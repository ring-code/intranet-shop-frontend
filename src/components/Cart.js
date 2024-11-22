import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Alert, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  const handleRemoveFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.productId !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart)); 
  };

  const handleIncreaseQuantity = (productId) => {  
    const updatedCart = [...cart];
    const itemIndex = updatedCart.findIndex(item => item.productId === productId);
    if (itemIndex >= 0) {
      updatedCart[itemIndex].quantity += 1;
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  const handleDecreaseQuantity = (productId) => {
    const updatedCart = [...cart];
    const itemIndex = updatedCart.findIndex(item => item.productId === productId);
    if (itemIndex >= 0 && updatedCart[itemIndex].quantity > 1) {
      updatedCart[itemIndex].quantity -= 1;
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="container mt-4 d-flex flex-column">
      <h2>Warenkorb</h2>

      {cart.length === 0 ? (
        <Alert variant="warning">Ihr Warenkorb ist leer.</Alert>
      ) : (
        <>
          {/* Cart Items List */}
          <ListGroup>
            {cart.map(item => (
              <ListGroup.Item key={item.productId}>
                <Row className="align-items-center">
                  <Col md={3}>
                    <img src={item.imageUrl || '/default-product-image.jpg'} alt={item.title} width="50" />
                  </Col>
                  <Col md={5}>
                    <h5>{item.title}</h5>
                    <p>{item.price} €</p>
                  </Col>
                  <Col md={4}>
                    <div className="d-flex align-items-center">
                      <Button variant="secondary" onClick={() => handleDecreaseQuantity(item.productId)}>-</Button>
                      <span className="mx-2">{item.quantity}</span>
                      <Button variant="secondary" onClick={() => handleIncreaseQuantity(item.productId)}>+</Button>
                    </div>
                    <Button variant="danger" className="mt-2" onClick={() => handleRemoveFromCart(item.productId)}>
                      Entfernen
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>

          {/* Bestellübersicht (Order Summary) - Moved to the bottom */}
          <Card className="shadow-sm mt-4">
            <Card.Body>
              <Card.Title>Bestellübersicht</Card.Title>
              <Card.Text>
                <strong>Gesamtpreis:</strong> {calculateTotal()} €
              </Card.Text>
              <Button variant="primary" onClick={handleCheckout} block>
                Zur Kasse
              </Button>
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
};

export default Cart;