import React, { useState } from 'react';

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
            const response = await fetch('https://fi.mshome.net:3001/register', {
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
        <div>
            <h2>Registrierung</h2>

            {error && <div className="error"><p>{error}</p></div>}
            {success && <div className="success"><p>Registierung erfolgreich!</p></div>}

            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                /><br /><br />

                <label htmlFor="password">Passwort:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                /><br /><br />

                <label htmlFor="pwcheck">Passwort bestätigen:</label>
                <input
                    type="password"
                    id="pwcheck"
                    name="pwcheck"
                    value={formData.pwcheck}
                    onChange={handleInputChange}
                    required
                /><br /><br />

                <button type="submit">Registrieren</button>
            </form>
        </div>
    );
};

export default RegistrationForm;
