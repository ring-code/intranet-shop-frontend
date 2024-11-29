import React, { useState } from 'react';
import { Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';  
import { useCart } from './CartContext'; 


/**
 * @name Cart
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
    <div className="container px-0 mt-4 mb-3">
      {cart.length === 0 ? 
      <h2 className=" mb-4">Warenkorb</h2>
      :
      <h2 className="picture-site-aligned-text mb-4">Warenkorb</h2>
      }
      {/* Main Card Container */}
      <Card.Body className="position-relative">
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
              <div key={product.product_id} className="mb-4">
                <Card
                  className="product-card shadow-sm d-flex align-items-stretch"
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'stretch',
                  }}
                >
                  {/* Image Container with fixed size */}
                  <div
                    style={{
                      flex: '0 0 150px',
                      height: '150px', // Fixed height
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center', // Ensure image is centered
                    }}
                  >
                    <img
                      className="ml-1 mb-1"
                      src={`${process.env.REACT_APP_SERVER_URL}/${product.image_url || '/default-product-image.jpg'}`}
                      alt={product.title}
                      style={{
                        width: '100%', // Ensure the image fills the container
                        height: '100%', // Ensure the image fills the container
                        objectFit: 'cover', // Ensure the image scales properly
                      }}
                    />
                  </div>
  
                  {/* Title, Description, and Price */}
                  <div
                    className="d-flex flex-column flex-grow-1 p-3"
                    style={{
                      justifyContent: 'space-between',
                    }}
                  >
                    {/* Title and Description */}
                    <div>
                      <Card.Title>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/products/${product.product_id}`, { state: { product } });
                          }}
                        >
                          {product.title}
                        </a>
                      </Card.Title>
                      <Card.Text>
                        {product.description.length > 100
                          ? product.description.substring(0, 100) + '...'
                          : product.description}
                      </Card.Text>
                    </div>
  
                    {/* Bottom Right Corner Quantity Control */}
                    <div
                      className="position-absolute"
                      style={{
                        bottom: '10px',
                        right: '10px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {/* Decrease Button */}
                      <button
                        className="minus-button btn btn-outline-secondary ms-2 me-2"
                        onClick={() => handleDecreaseQuantity(product.product_id)}
                      >
                        -
                      </button>
  
                      {product.quantity}
                      {/* Increase Button */}
                      <button
                        className="plus-button btn btn-outline-secondary ms-2 me-2"
                        onClick={() => handleIncreaseQuantity(product.product_id)}
                      >
                        +
                      </button>
                      <strong> {(product.price * product.quantity).toFixed(2)} €</strong>
                    </div>
                  </div>
                </Card>
  
                {/* Delete Button */}
                <Card
                  className="remove-from-cart-card shadow-sm mb-3 mt-2"
                  onClick={() => handleRemoveFromCart(product.product_id)} 
                  style={{
                    cursor: 'pointer',
                    padding: '15px',
                    backgroundColor: '#f8d7da',
                    textAlign: 'center',
                  }}
                >
                  Aus Warenkorb entfernen
                </Card>
              </div>
            ))}
  
            {/* Total Price for All Products */}
            <div className="d-flex justify-content-between align-items-center w-100">
              <h3 className="picture-site-aligned-text text-center w-100" style={{ whiteSpace: 'nowrap' }}>
                Gesamtpreis für alle Produkte:
              </h3>
              <h3 className="ms-auto" style={{ whiteSpace: 'nowrap' }}>
                <strong>{calculateTotal()} €</strong>
              </h3>
            </div>
  
            {cart.length > 0 && (
              <Card
                className="add-to-cart-card shadow-sm"
                style={{ flex: '1', marginTop: '20px' }}
                onClick={placeOrder}
              >
                <Card.Body>Bestellung abschicken</Card.Body>
              </Card>
            )}
          </>
        )}
      </Card.Body>
    </div>
  );
  
  
    
  
};

export default Cart;
