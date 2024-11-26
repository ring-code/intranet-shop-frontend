import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({isLoggedIn}) => {
    return (
        <>
        <br />
        <h1>Herzlich Willkommen im Mitarbeiter-Shop!</h1>
        {isLoggedIn ?
        <h2>Sie sind eingeloggt</h2>
        :
        <h2 className ="home-link">Bitte <Link to="/login">anmelden</Link> oder <Link to="/login">registrieren</Link>.</h2>}
           
        </>
    
    )
}

export default Home;
