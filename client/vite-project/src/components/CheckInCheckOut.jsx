import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CheckInCheckOut() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleCheckInOut = async (type) => {
    if (!password) {
      setErrorMessage('must enter a Password');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok && data.success) {
        const checkInOutRes = await fetch(`http://localhost:3001/${type}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username }),
        });

        if (!checkInOutRes.ok) {
          throw new Error('Error with updating the time');
        }

        const checkInOutData = await checkInOutRes.json();
        alert(checkInOutData.message);
        setErrorMessage(''); 
      } else {
        setErrorMessage(data.message || 'Incorrect username or password');
      }
    } catch (error) {
      setErrorMessage('Error with server request');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Check In / Check Out</h2>

      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <button onClick={() => handleCheckInOut('checkin')}>Check In</button>
      <button onClick={() => handleCheckInOut('checkout')}>Check Out</button>

      {username === 'admin' && (
        <button onClick={() => navigate('/admin')}>Go to Admin</button>
      )}
    </div>
  );
}

export default CheckInCheckOut;
