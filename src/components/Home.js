import React from 'react';

const Home = ({isLoggedIn}) => {
    return (
        <>
        <h1>Herzlich Willkommen</h1>
        {isLoggedIn ?
        <h2>Sie sind eingeloggt</h2>
        :
        <h2>Bitte loggen Sie sich ein</h2>}

        </>
    
    )
}

export default Home;
