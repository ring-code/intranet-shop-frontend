import React, { useState } from 'react';
import { Row, Col, Card, Button, Alert, Form, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../utils/AuthUtil'; // Import the shared login logic

const RegistrationForm = ({ setIsLoggedIn, setIsAdmin = () => {} }) => {
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    pwcheck: '',
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.pwcheck) {
      setError('Passwörter stimmen nicht überein!');
      setSuccess(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Registrierung erfolgreich! Sie werden automatisch eingeloggt.');
        setError(null);

        // Log the user in after registration
        await loginUser({
          email: formData.email,
          password: formData.password,
          setIsLoggedIn,
          setIsAdmin,
          setSuccess,
          setError,
          navigate,
        });
      } else {
        setError(result.error || 'Registrierung fehlgeschlagen.');
      }
    } catch (err) {
      setError('Ein Fehler ist aufgetreten. Versuchen Sie es erneut.');
    }
  };

  return (
    <Container className="mt-5">
      <h1>Registrierung</h1>
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              <Form onSubmit={handleSubmit} className="mt-4">
                <Form.Group controlId="email" className="mb-3">
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="E-Mail-Adresse"
                  />
                </Form.Group>
                <Form.Group controlId="password" className="mb-3">
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Passwort"
                  />
                </Form.Group>
                <Form.Group controlId="pwcheck" className="mb-3">
                  <Form.Control
                    type="password"
                    name="pwcheck"
                    value={formData.pwcheck}
                    onChange={handleInputChange}
                    required
                    placeholder="Passwort bestätigen"
                  />
                </Form.Group>
                <Button type="submit" variant="primary" className="w-100">
                  Registrieren
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegistrationForm;
