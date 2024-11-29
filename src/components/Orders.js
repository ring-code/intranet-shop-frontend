import React, { useState, useEffect } from 'react';
import { Card, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

/**
 * @module Orders
 * @name Orders
 * @description This component displays a list of orders for the currently logged-in user. 
 * It fetches the orders from the server and shows order details including the products, their quantities, 
 * prices, and the total amount for each order. It also handles loading and error states.
 * 
 * @returns {JSX.Element} The Orders component which renders a list of orders.
 */
const Orders = () => {
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');

  /**
   * @function useEffect
   * @description Runs when the component mounts to fetch the orders for the user from the server.
   * Sets the orders state, and handles loading and error states.
   * @returns {void}
   */
  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/orders`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        
        if (response.ok) {
          // Sort orders by order_id in descending order
          const sortedOrders = data.sort((a, b) => b.order_id - a.order_id);
          setOrders(sortedOrders);
        }
      } catch (err) {
        setError('Ein Fehler ist aufgetreten.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  /**
   * @function handleCardClick
   * @description Navigates to the product detail page when a product card is clicked.
   * @param {Object} product - The product object that was clicked.
   * @param {number} product.product_id - The unique identifier for the product.
   * @returns {void}
   */
  const handleCardClick = (product) => {
    navigate(`/products/${product.product_id}`, { state: { product } });
  };

  // Display a loading spinner while fetching orders
  if (loading) {
    return <div className="text-center"><Spinner animation="border" variant="primary" /></div>;
  }

  // Display an error message if an error occurred during fetching
  if (error) {
    return <div className="text-center"><Alert variant="danger">{error}</Alert></div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Bestellungen für {userEmail}</h2>
      {orders.length === 0 ? (
        <div className="text-center w-100">
          <Alert variant="warning" style={{ backgroundColor: '#fff3cd', color: '#856404' }}>
            Keine Bestellungen gefunden.
          </Alert>
        </div>
      ) : (
        orders.map((order) => (
          <Card className="mb-4 shadow-sm" key={order.order_id}>
            <Card.Body>
              <Card.Title className="text-center">
                Bestellung vom: {new Date(order.order_date).toLocaleString('de-DE', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Card.Title>
              <hr />
              <div className="order-items">
                {order.items.map((item) => (
                  <div className="mb-2" key={item.product_id}>
                    <Card className="product-description-card shadow-sm mb-2" onClick={() => handleCardClick(item)}>
                      <Card.Body className="d-flex justify-content-between align-items-center">
                        <Card.Title className="mb-0 text-center w-100">{item.quantity}x {item.title}</Card.Title>
                        <div className="text-end">
                          <strong>{item.price}€</strong>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </div>
              <hr />
              <div className="total-amount d-flex justify-content-between align-items-center">
                <h5 className="mb-0 text-center w-100">Gesamtbetrag:</h5>
                <h5 className="mb-0 text-end"><strong>{order.total_amount}€</strong></h5>
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default Orders;
