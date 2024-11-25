import React from 'react';
import { Row, Col, Card, Button, Alert, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';  
import { useCart } from './CartContext'; 

const Cart = () => {
  const { cart, setCart } = useCart(); // Use cart context
  const navigate = useNavigate();  

  // Remove product from cart
  const handleRemoveFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.product_id !== productId); 
    setCart(updatedCart); 
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Increase product quantity
  const handleIncreaseQuantity = (productId) => {
    const updatedCart = [...cart];
    const itemIndex = updatedCart.findIndex(item => item.product_id === productId); 
    if (itemIndex >= 0) {
      updatedCart[itemIndex].quantity += 1;
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  // Decrease product quantity
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


  // Calculate total price for all items in cart
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  // Navigate to checkout page
  const handleCheckout = () => {
    navigate('/checkout');
  };

  // Handle product click (navigating to product details page)
  const handleProductClick = (product) => {
    navigate(`/products/${product.product_id}`, { state: { product } });
  };

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
        alert('Bestellung erfolgreich!');
        setCart([]); // Clear cart
        localStorage.removeItem('cart'); // Clear cart in localStorage
        navigate('/orders', { state: { order: data } });
      } else {
        alert('Bestellung fehlgeschlagen.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('An error occurred while placing your order.');
    }
  };

  return (
    <div className="container mt-4 d-flex flex-column">
      <h2>Warenkorb</h2>
  
      {cart.length === 0 ? (
        <Alert variant="warning">Ihr Warenkorb ist leer.</Alert>
      ) : (
        <>
          <ListGroup>
            {cart.map(item => (
              <ListGroup.Item key={item.product_id}>
                <Row className="align-items-center">
                  {/* Image and Title */}
                  <Col md={3}>
                    <img
                      src={`${process.env.REACT_APP_SERVER_URL}/${item.image_url || '/default-product-image.jpg'}`}
                      alt={item.title}
                      width="100"
                    />
                  </Col>
                  <Col md={5}>
                    {/* Product title links to details */}
                    <h5
                      style={{ cursor: 'pointer', color: 'blue' }}
                      onClick={() => handleProductClick(item)}  
                    >
                      {item.title}
                    </h5>
                    <br />
                    <p>{item.price} €</p>
  
                    {/* Quantity buttons below price */}
                    <div className="d-flex flex-column align-items-center mt-2">
                    <div className="d-flex align-items-center">
                      <Button variant="secondary" onClick={() => handleDecreaseQuantity(item.product_id)}>-</Button>
                      <span
                        className="mx-2"
                        style={{ flex: 1, textAlign: 'center' }}
                      >
                        {item.quantity}
                      </span>
                        <Button variant="secondary" onClick={() => handleIncreaseQuantity(item.product_id)}>+</Button>
                      </div>
                    </div>
                  </Col>
  
                  {/* Total price for the product and Remove button */}
                  <Col md={4} className="text-center text-md-start">
                    <div className="d-flex flex-column align-items-center align-items-md-start">
                      <div className="mt-1">
                        <strong>Gesamtpreis:</strong> {(item.price * item.quantity).toFixed(2)}€                        
                      </div>
                    </div>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
  
          {/* Total Price Card */}
          <Card className="shadow-sm mt-4">
            <Card.Body>
              <Card.Title>Gesamtpreis für alle Produkte:</Card.Title>
              <Card.Text>
                <strong> {calculateTotal()} €</strong>
              </Card.Text>
              <Button variant="primary" onClick={placeOrder} style={{ width: '100%' }}>
                Bestellung abschicken
              </Button>
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
  
  
}  

export default Cart;
