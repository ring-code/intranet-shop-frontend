import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Alert, Form } from 'react-bootstrap';
import BackButton from './BackButton';

/**
 *  @module AdminInsert
 * 
 * @description A component for adding new products to the admin panel. Allows the user to input product details,
 * upload an image, and submit the form to the server.
 * @returns {JSX.Element} The AdminProductInsert component.
 */
const AdminProductInsert = () => {
  const navigate = useNavigate();

  /**
   * @typedef {Object} FormData
   * @property {string} title - The title of the product.
   * @property {string} price - The price of the product in euros.
   * @property {string} description - The description of the product.
   * @property {File|null} image - The image file for the product.
   */

  
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    image: null,
  });

  const [imagePreview, setImagePreview] = useState('');

  const [imageFileName, setImageFileName] = useState('');

  const [successMessage, setSuccessMessage] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  /**
   * @function handleChange
   * @description Updates the state for form fields when the user types in the input fields.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event from the input field.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  /**
   * @function handleImageChange
   * @description Handles the selection of an image file, sets the image preview, and updates the form data.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event from the file input.
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        image: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      setImageFileName(file.name);
    }
  };

  /**
   * @function validateFormData
   * @description Validates the form data to ensure all required fields are filled.
   * @returns {boolean} True if the form data is valid, false otherwise.
   */
  const validateFormData = () => {
    if (!formData.title || !formData.price || !formData.description) {
      setErrorMessage('Alle Felder müssen ausgefüllt werden.');
      return false;
    }
    return true;
  };

  /**
   * @function handleSave
   * @description Submits the product data to the server if the form is valid.
   * Displays success or error messages based on the response.
   */
  const handleSave = async () => {
    if (!validateFormData()) {
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('title', formData.title);
    formDataToSubmit.append('price', formData.price);
    formDataToSubmit.append('description', formData.description);
    if (formData.image) {
      formDataToSubmit.append('image', formData.image);
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/admin/insert`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSubmit,
      });

      if (response.ok) {
        setSuccessMessage('Produkt erfolgreich hinzugefügt!');
        setTimeout(() => {
          navigate('/admin/products');
        }, 2000);
      } else {
        setErrorMessage('Fehler beim Hinzufügen des Produkts');
      }
    } catch (err) {
      console.error('Error inserting product:', err);
      setErrorMessage('Ein Fehler ist aufgetreten.');
    }
  };

  return (
    <div className="container mt-4">
      <h1>Neues Produkt hinzufügen</h1>
      <Card className="product-details-card shadow-sm">
        <Card.Body>
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

          <Form>
            <table className="table table-striped mb-3">
              <tbody>
                <tr>
                  <td><strong>Bild</strong></td>
                  <td>
                    {imagePreview && (
                      <div className="mb-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{ maxWidth: '200px', marginBottom: '10px' }}
                        />
                      </div>
                    )}
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td><strong>Titel</strong></td>
                  <td>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td><strong>Preis (€)</strong></td>
                  <td>
                    <Form.Control
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td><strong>Beschreibung</strong></td>
                  <td>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                    />
                    <small className="text-muted">
                      Format für Tabellen-Output mit 2 Spalten <code>Key: Value</code> Delimiter <code>|</code>
                    </small>
                  </td>
                </tr>
              </tbody>
            </table>
            <Card
              className="add-to-cart-card shadow-sm mb-3"
              onClick={handleSave}
              style={{ cursor: 'pointer', padding: '15px' }}
            >
              Speichern
            </Card>
            <BackButton />
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminProductInsert;
