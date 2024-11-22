import React, { useState } from 'react';
import { Form, Button, Alert, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


function Login({isLoggedIn, setIsLoggedIn}) {
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.elements.email.value;
        const password = e.target.elements.password.value;
        try {
          const response = await fetch(`https://fi.mshome.net:3001/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password }),
          });
          const data = await response.json();

          if (response.ok) {
            localStorage.setItem('token', data.token); 
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('userEmail', data.userEmail);
            setMessage('Erfolgreich eingeloggt! Sie werden zum Shop weitergeleitet.');
            setIsLoggedIn(true);
            setTimeout(() => {
                navigate('/products');
            }, 2000);
          } else {
            setMessage(data.error || 'Login fehlgeschlagen');
          }
        } catch (error) {
          console.error("Fehler beim Login:", error);
          setMessage("Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");
        }
    };

    return (
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
        <Card className="text-center shadow-sm">
            <Card.Body>
            <Card.Title>Anmelden</Card.Title>

            {message && <Alert variant={isLoggedIn ? "success" : "danger"}>{message}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email" className="mb-3">
                <Form.Label>Benutzername</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="E-Mail-Adresse"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                </Form.Group>

                <Form.Group controlId="password" className="mb-3">
                <Form.Label>Passwort</Form.Label>
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
    );
}

export default Login;