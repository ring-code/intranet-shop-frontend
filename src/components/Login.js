/**
 * @module Login
 * @description This component allows users to log in by providing an email and password. 
 * It communicates with an authentication API and sets the user's login status and role.
 * @returns {JSX.Element} The Login Component
 */


import React, { useState } from 'react';
import { Row, Col, Card, Button, Alert, Form, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../utils/AuthUtil.js'; // Import the shared login logic

/**
 * @function Login
 * @param {Object} props - The properties passed to the component.
 * @param {Function} props.setIsLoggedIn - A function to update the user's logged-in status.
 * @param {Function} props.setIsAdmin - A function to set the user's admin status.
 * 
 */
function Login({setIsLoggedIn, setIsAdmin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  
  /**
   * @function handleSubmit
   * @description Handles the form submission for logging in. It calls the loginUser function to authenticate the user and sets the login status.
   * @param {React.FormEvent<HTMLFormElement>} e - The event triggered by form submission.
   * @returns {Promise<void>} A promise that resolves after the login attempt completes.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    await loginUser({ email, password, setIsLoggedIn, setIsAdmin, setSuccess, setError, navigate });
  };

  return (
    <Container className="mt-5">
      <h1>Anmeldung</h1>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email" className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="E-Mail-Adresse"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="password" className="mb-3">
                  <Form.Control
                    type="password"
                    placeholder="Passwort eingeben"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">
                  Anmelden
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
