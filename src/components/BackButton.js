import React from 'react';
import { Button } from 'react-bootstrap';
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
    <Button variant="primary" className="back-button" onClick={handleBack}>
        Zurück
    </Button>
  );
};

export default BackButton;