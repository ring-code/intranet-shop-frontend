import React, { useState, useEffect } from 'react';
import { Card, Spinner, Alert, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null); // State for selected product details
  const navigate = useNavigate();

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
            console.log('Fetched orders:', data); // Log the data to check if it's grouped properly
            if (response.ok) {
                setOrders(data);
            } else {
                setError('Fehler beim Laden der Bestellungen.');
            }
        } catch (err) {
            setError('Ein Fehler ist aufgetreten.');
        } finally {
            setLoading(false);
        }
    };

    fetchOrders();
}, []);

  const handleImageClick = (imageUrl, product) => {
    setModalImage(imageUrl); // Set the image URL
    setSelectedProduct(product); // Set the selected product details
    setShowModal(true); // Open the modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };

  if (loading) {
    return <div className="text-center"><Spinner animation="border" variant="primary" /></div>;
  }

  if (error) {
    return <div className="text-center"><Alert variant="danger">{error}</Alert></div>;
  }

  return (
    <div className="container mt-4">
      <h2>Bestellungen</h2>
      {orders.length === 0 ? (
        <div className="text-center w-100">
          <Alert variant="warning">Keine Bestellungen gefunden.</Alert>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order.order_id} className="order-wrapper mb-4">
            <h5>Bestellung #{order.order_id}</h5>
            <p><strong>Datum:</strong> {new Date(order.order_date).toLocaleDateString()}</p>
            <p><strong>Gesamtbetrag:</strong> {order.total_amount}€</p>
            

            {order.items.map((item) => (
              <div className="product-wrapper mb-3 d-flex" key={item.product_id}>
                {/* Product Image */}
                <div
                  className="me-3"
                  style={{ flex: '0 0 150px', cursor: 'pointer' }}
                  onClick={() => handleImageClick(`${process.env.REACT_APP_SERVER_URL}/${item.image_url}`, item)}
                >
                  <Card className="shadow-sm">
                    <Card.Img
                      variant="top"
                      src={`${process.env.REACT_APP_SERVER_URL}/${item.image_url}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Card>
                </div>

                {/* Product Details */}
                <div className="d-flex flex-column flex-grow-1 align-items-stretch">
                  <Card className="product-card shadow-sm mb-2">
                    <Card.Body>
                      <Card.Title>{item.title}</Card.Title>
                      <Card.Text>
                        <strong>Menge:</strong> {item.quantity}<br />
                        <strong>Einzelpreis:</strong> {item.price}€<br />
                        <strong>Gesamt:</strong> {(item.quantity * item.price).toFixed(2)}€
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        ))
      )}

      {/* Modal to show larger image */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedProduct?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={modalImage} alt="Large Product" className="img-fluid" />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Orders;
