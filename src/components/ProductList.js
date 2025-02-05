import React, { useState, useEffect } from 'react';
import { Card, Spinner, Alert, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';


/**
 * @module ProductList
 * @description ProductList component fetches a list of products from the server,
 * displays them in cards, and allows users to view details or add products to the cart.
 * 
 * 
 * @returns {JSX.Element} The product list with loading and error states, and product image modal.
 */
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const navigate = useNavigate();
  const { handleAddToCart } = useCart();
  
  /**
   * Fetch products from the server and handle errors or loading state.
   * 
   * @async
   * @function fetchProducts
   * @returns {void}
   */
  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/products`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
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
  }, []);

  /**
   * Handle the click event on a product card to navigate to its detail page.
   * @function handleCardClick
   * @param {Object} product - The product that was clicked.
   * @returns {void}
   */
  const handleCardClick = (product) => {
    navigate(`/products/${product.product_id}`, { state: { product } });
  };

  /**
   * Handle the click event on an image to open the product image in a modal.
   * @function handleImageClick
   * @param {string} imageUrl - The URL of the image to be displayed in the modal.
   * @param {Object} product - The product associated with the image.
   * @returns {void}
   */
  const handleImageClick = (imageUrl, product) => {
    setModalImage(imageUrl); // Set the image URL
    setSelectedProduct(product); // Set the selected product to access its title
    setShowModal(true); // Open the modal
  };

  
  /**
   * Close the modal when called.
   * @function handleCloseModal
   * @returns {void}
   */
  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };

  
  
  if (loading) {
    return <div className="text-center"><Spinner animation="border" variant="primary" /></div>;
  }

  if (error) {
    return <div className="text-center mt-4"><Alert variant="danger">{error}</Alert></div>;
  }

  return (
    <div className="container px-0 mt-4">
      <h2 className="picture-site-aligned-text">Produkte</h2>
      {products.length === 0 ? (
        <div className="text-center w-100">
          <Alert variant="warning">Keine Produkte gefunden.</Alert>
        </div>
      ) : (
        products.map((product) => (
          <div className="product-wrapper mb-4 d-flex" key={product.product_id}>
            {/* Image Card on the Left */}
            <div className="me-3" style={{ flex: '0 0 150px', display: 'flex', flexDirection: 'column' }}>
              <Card className="shadow-sm" style={{ cursor: 'pointer', height: '100%' }} onClick={() => handleImageClick(`${process.env.REACT_APP_SERVER_URL}/${product.image_url || '/static/images/default-product.jpg'}`, product)}>
                <Card.Img
                  variant="top"
                  src={`${process.env.REACT_APP_SERVER_URL}/${product.image_url || '/images/default-product.jpg'}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Card>
            </div>

            {/* Right Side - Two Cards */}
            <div className="d-flex flex-column flex-grow-1 align-items-stretch" style={{ height: '100%' }}>
              {/* Description & Price Card */}
              <Card
                className="product-description-card shadow-sm mb-2"
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

              {/* "In den Warenkorb" Card */}
              <Card
                className="add-to-cart-card shadow-sm"
                style={{ cursor: 'pointer', flex: '0 0 30%' }}
                onClick={() => handleAddToCart(product.product_id, product.price, product.title, product.description, product.image_url)}
              >
                <Card.Body className="d-flex justify-content-center align-items-center">
                  <span className="text-muted d-block">In den Warenkorb</span>
                </Card.Body>
              </Card>
            </div>
          </div>
        ))
      )}

      {/* Modal to show the larger image */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg" className="custom-modal">
        <Modal.Header closeButton className="modal-header-center">
          <Modal.Title>{selectedProduct?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={modalImage} alt="Large Product" className="img-fluid" />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProductList;
