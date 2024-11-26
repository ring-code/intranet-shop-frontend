import React, { useState } from 'react';
import { Row, Col, Card, Button, Alert, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';  
import { useCart } from './CartContext'; 


/**
 * Cart component where users can view and manage their shopping cart items.
 * Users can increase/decrease quantities of items, remove items, and place orders.
 */
const Cart = () => {
  const { cart, setCart } = useCart(); // Use cart context
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const navigate = useNavigate();  

  /**
   * Removes an item from the cart.
   * @param {number} productId - The ID of the product to remove from the cart.
   */
  const handleRemoveFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.product_id !== productId); 
    setCart(updatedCart); 
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  /**
   * Increases the quantity of a product in the cart.
   * @param {number} productId - The ID of the product to increase quantity for.
   */
  const handleIncreaseQuantity = (productId) => {
    const updatedCart = [...cart];
    const itemIndex = updatedCart.findIndex(item => item.product_id === productId); 
    if (itemIndex >= 0) {
      updatedCart[itemIndex].quantity += 1;
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  /**
   * Decreases the quantity of a product in the cart.
   * If the quantity reaches zero, it removes the product from the cart.
   * @param {number} productId - The ID of the product to decrease quantity for.
   */
  const handleDecreaseQuantity = (productId) => {
    const updatedCart = [...cart];
    const itemIndex = updatedCart.findIndex(item => item.product_id === productId);
  
    if (itemIndex >= 0) {
      // Decrease the quantity if it's greater than 1
      if (updatedCart[itemIndex].quantity > 1) {
        updatedCart[itemIndex].quantity -= 1;
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      } 
      // Remove the item from the cart if the quantity reaches 0
      else {
        handleRemoveFromCart(productId);
      }
    }
  };

  /**
   * Calculates the total price for all items in the cart.
   * @returns {string} The total price formatted as a string with two decimal places.
   */
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  
  /**
   * Handles card click for navigating to the product details page.
   * @param {Object} product - The product object to navigate to.
   */
  const handleCardClick = (product) => {
    navigate(`/products/${product.product_id}`, { state: { product } });
  };

  /**
   * Places the order for the products in the cart by sending a request to the server.
   * Clears the cart and navigates to the orders page upon successful order placement.
   */
  const placeOrder = async () => {
    const token = localStorage.getItem('token'); // Get user authentication token
    const orderPayload = {
      cart: cart.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: calculateTotal(),
    };
    
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });
  
      if (response.ok) {
        const data = await response.json();
        setSuccessMessage('Bestellung erfolgreich!'); // Set success message
        setCart([]); // Clear cart
        localStorage.removeItem('cart'); // Clear cart in localStorage
        setTimeout(() => {
        navigate('/orders', { state: { order: data } });
        }, 2000);
      } else {
        setErrorMessage('Bestellung fehlgeschlagen.'); // Set error message
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setErrorMessage('Ein Fehler ist aufgetreten.'); // Set error message
    }
  };

  return (
    <div className="container mt-4">
      <h2 style={{ marginLeft: '150px' }}>Warenkorb</h2>
  
      {/* Success and Error Messages */}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
  
      {cart.length === 0 ? (
        <div className="text-center w-100">
          <Alert variant="warning">Ihr Warenkorb ist leer.</Alert>
        </div>
      ) : (
        <>
          {cart.map((product) => (
            <div className="product-wrapper mb-4 d-flex" key={product.product_id} style={{ alignItems: 'stretch' }}>
              {/* Left Image Card */}
              <div className="me-3" style={{ flex: '0 0 150px', display: 'flex', flexDirection: 'column' }}>
                <Card className="shadow-sm" style={{ height: '100%' }}>
                  <Card.Img
                    variant="top"
                    src={`${process.env.REACT_APP_SERVER_URL}/${product.image_url || '/default-product-image.jpg'}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Card>
              </div>
  
              {/* Right Side: Description, Quantity, and Total Price */}
              <div className="d-flex flex-column flex-grow-1" style={{ height: '100%' }}>
                {/* Description & Price Card */}
                <Card
                  className="product-card shadow-sm mb-2"
                  onClick={() => handleCardClick(product)}
                  style={{ cursor: 'pointer', flex: '1' }}
                >
                  <Card.Body>
                    <Card.Title>{product.title}</Card.Title>
                    <Card.Text>
                      {product.description.length > 100
                        ? product.description.substring(0, 100) + '...'
                        : product.description}
                    </Card.Text>
                    <div className="d-flex justify-content-center align-items-center">
                      <strong>{product.price}€</strong>
                    </div>
                  </Card.Body>
                </Card>
  
                {/* Row for Quantity Control and Total Price */}
                <Row className="w-100 mt-2 d-flex" style={{ flex: '1' }}>
                  {/* Decrease Button Card */}
                  <Col xs={3} className="d-flex">
                    <Card
                      className="shadow-sm mb-2"
                      style={{ cursor: 'pointer', flex: '1', height: '100%' }}
                      onClick={() => handleDecreaseQuantity(product.product_id)}
                    >
                      <Card.Body className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                        <span className="text-muted d-block">-</span>
                      </Card.Body>
                    </Card>
                  </Col>
  
                  {/* Quantity Card */}
                  <Col xs={3} className="d-flex">
                    <Card className="shadow-sm mb-2" style={{ flex: '1', height: '100%' }}>
                      <Card.Body className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                        <span className="text-muted d-block">{product.quantity}</span>
                      </Card.Body>
                    </Card>
                  </Col>
  
                  {/* Increase Button Card */}
                  <Col xs={3} className="d-flex">
                    <Card
                      className="shadow-sm mb-2"
                      style={{ cursor: 'pointer', flex: '1', height: '100%' }}
                      onClick={() => handleIncreaseQuantity(product.product_id)}
                    >
                      <Card.Body className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                        <span className="text-muted d-block">+</span>
                      </Card.Body>
                    </Card>
                  </Col>
  
                  {/* Total Price Card */}
                  <Col xs={3} className="d-flex">
                    <Card className="product-card shadow-sm mb-2" style={{ flex: '1', height: '100%' }}>
                      <Card.Body className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                        <strong>{(product.price * product.quantity).toFixed(2)}€</strong>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>
            </div>
          ))}
  
          {/* Total Price for All Products */}
          {cart.length > 0 && (
            <Card className="product-card shadow-sm mb-2" style={{ flex: '1' }}>
              <Card.Body>
                <Card.Title>Gesamtpreis für alle Produkte:</Card.Title>
                <Card.Text>
                  <strong>{calculateTotal()} €</strong>
                </Card.Text>
                <Button variant="primary" onClick={placeOrder} style={{ width: '100%' }}>
                  Bestellung abschicken
                </Button>
              </Card.Body>
            </Card>
          )}
        </>
      )}
    </div>
  );
  
  
  
  
  
  
};

export default Cart;
