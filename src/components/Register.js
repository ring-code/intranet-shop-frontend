import React, { useState } from 'react';
import { Row, Col, Card, Button, Alert, Form, Container } from 'react-bootstrap';

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        pwcheck: '',
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // password check
        if (formData.password !== formData.pwcheck) {
            setError('Passwörter stimmen nicht überein!');
            setSuccess(false);
            return;
        }

        try {
            // POST request to backend for registration
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
                setSuccess(true);
                setError(null);
            } else {
                setError(result.error || 'Registrierung fehlgeschlagen.');
                setSuccess(false);
            }
        } catch (err) {
            setError('Ein Fehler ist aufgetreten. Versuchen Sie es erneut.');
            setSuccess(false);
        }
    };

    return (
        <Container className="mt-5">
          <h1>Registrierung</h1>
          <Row className="justify-content-center">
            <Col md={6}>
              <Card className="text-center shadow-sm">
                <Card.Body>
                  
    
                  {/* Error and Success Alerts */}
                  {error && <Alert variant="danger">{error}</Alert>}
                  {success && <Alert variant="success">{success}</Alert>}
    
                  <Form onSubmit={handleSubmit} className="mt-4">
                    {/* Email Field */}
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
    
                    {/* Password Field */}
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
    
                    {/* Password Confirmation Field */}
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
    
                    {/* Submit Button */}
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
