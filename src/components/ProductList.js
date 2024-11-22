import React, { useEffect, useState } from 'react';
import { Card, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate(); // For programmatic navigation

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('https://fi.mshome.net:3001/products', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setProducts(data);
        } else {
          setError('Fehler beim Laden der Produkte.');
        }
      } catch (err) {
        setError('Ein Fehler ist aufgetreten.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  const handleAddToCart = (productId, price, title, image_url) => {
    const newCart = [...cart];
    const itemIndex = newCart.findIndex((item) => item.productId === productId);
    
    if (itemIndex >= 0) {
      newCart[itemIndex].quantity += 1;
    } else {
      newCart.push({ productId, quantity: 1, price, title, image_url });
    }

    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const handleCardClick = (product) => {
    // Pass the product details via the state object
    navigate(`/products/${product.id}`, { state: { product } });
  };

  if (loading) {
    return <div className="text-center"><Spinner animation="border" variant="primary" /></div>;
  }

  if (error) {
    return <div className="text-center"><Alert variant="danger">{error}</Alert></div>;
  }

  return (
    <div className="container mt-4">
      {products.length === 0 ? (
        <div className="text-center w-100">
          <Alert variant="warning">Keine Produkte gefunden.</Alert>
        </div>
      ) : (
        products.map((product) => (
          <div className="product-wrapper mb-4" key={product.id}>
            <Card
              className="product-card shadow-sm"
              onClick={() => handleCardClick(product)} // Pass the entire product to the ProductDetails component
              style={{ cursor: 'pointer' }}
            >
              <Card.Body>
                <div className="d-flex align-items-start">
                  <div className="me-3">
                    <Card.Img
                      variant="top"
                      src={`https://fi.mshome.net:3001/${product.image_url || '/static/images/default-product.jpg'}`}
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="flex-grow-1">
                    <Card.Title>{product.title}</Card.Title>
                    <Card.Text>
                      {product.description.length > 100
                        ? product.description.substring(0, 100) + '...'
                        : product.description}
                    </Card.Text>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card
              className="add-to-cart-card shadow-sm"
              style={{ cursor: 'pointer' }}
              onClick={() => handleAddToCart(product.id, product.price, product.title, product.imageUrl)}
            >
              <Card.Body className="text-center">
                <span className="text-muted d-block">In den Warenkorb</span>
              </Card.Body>
            </Card>
          </div>
        ))
      )}
    </div>
  );
};

export default ProductList;
