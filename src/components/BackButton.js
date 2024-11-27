import React from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate(); // Initialize navigation

  const handleBack = () => {
    // Navigate backward
    if (window.history.length > 2) {
      navigate(-1); // React Router's method
    } else {
      alert("No pages to go back to!"); // Optional fallback
    }
  };

  return (
    <Card
      className="back-card shadow-sm text-center"
      onClick={handleBack}
      
    >
      <Card.Body>
        Zurück
        
      </Card.Body>
    </Card>
  );
};

export default BackButton;
