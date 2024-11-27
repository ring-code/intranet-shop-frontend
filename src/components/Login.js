import React, { useState } from 'react';
import { Row, Col, Card, Button, Alert, Form, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


function Login({isLoggedIn, setIsLoggedIn, setIsAdmin}) {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.elements.email.value;
        const password = e.target.elements.password.value;
        try {
          const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password }),
          });
          const data = await response.json();

          if (response.ok) {
            const isAdminBool = data.isAdmin === 1 ? 'true' : 'false';

            localStorage.setItem('token', data.token); 
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('userEmail', data.userEmail);
            localStorage.setItem('isAdmin', isAdminBool);
            localStorage.setItem('cart', '[]');
            localStorage.setItem('isLoggedIn', 'true');
            setIsLoggedIn(true);
            setIsAdmin(data.isAdmin);           
            setSuccess('Erfolgreich eingeloggt! Sie werden zum Shop weitergeleitet.');
            setTimeout(() => {
                navigate('/products');
            }, 2000);
          
          } else {
            setError(data.error || 'Login fehlgeschlagen');
          }
        } catch (error) {
          console.error("Fehler beim Login:", error);
          setError("Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");
        }
        
    };

     return (
      
    <Container className="mt-5">
      <h1>Anmeldung</h1>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title></Card.Title>

              {/* Error and Success Alerts */}
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                {/* Email (Username) Field */}
                <Form.Group controlId="email" className="mb-3">
                  
                  <Form.Control
                    type="email"
                    placeholder="E-Mail-Adresse"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                {/* Password Field */}
                <Form.Group controlId="password" className="mb-3">
                  
                  <Form.Control
                    type="password"
                    placeholder="Passwort eingeben"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                {/* Submit Button */}
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
};

export default Login;