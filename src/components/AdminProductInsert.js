import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Alert, Form } from 'react-bootstrap';
import BackButton from './BackButton';

const AdminProductInsert = () => {
  const navigate = useNavigate();

  // Initialize formData with default values
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    image: null,
  });

  // New state for image preview
  const [imagePreview, setImagePreview] = useState('');

  // New state for showing the image file name and path
  const [imageFileName, setImageFileName] = useState('');

  // State for success and error messages
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        image: file,
      }));

      // Create a URL for the selected image and update the image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set the preview URL
      };
      reader.readAsDataURL(file);

      // Set the file name for the selected image
      setImageFileName(file.name);
    }
  };

  // Validate the form data before submitting
  const validateFormData = () => {
    if (!formData.title || !formData.price || !formData.description) {
      setErrorMessage('Alle Felder müssen ausgefüllt werden.');
      return false;
    }
    return true;
  };

  // Handle save or insert product details
  const handleSave = async () => {
    if (!validateFormData()) {
      return; // Prevent submission if validation fails
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
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSubmit,  // Body contains FormData
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
          {/* Displaying success and error messages */}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

          <Form>
            {/* Table for Editable Fields */}
            <table className="table table-striped mb-3">
              <tbody>
                {/* Image Row */}
                <tr>
                  <td><strong>Bild</strong></td>
                  <td>
                    {/* Show current image or new preview */}
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

                {/* Title */}
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

                {/* Price */}
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

                {/* Description */}
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

            {/* Save Button */}
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
