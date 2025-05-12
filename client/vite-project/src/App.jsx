import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';  
import CheckInCheckOut from './components/CheckInCheckOut';
import AdminUpdate from './components/AdminUpdate';

function App() {
  const [time, setTime] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/time')
      .then((res) => res.json())
      .then((data) => setTime(data.datatime))
      .catch((error) => console.log('Error:', error));
  }, []);

  return (
    <Router>
      <div style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <h1 style={{ color: 'red', fontSize: '40px' }}>Germany Time:</h1>
        <p style={{ fontSize: '24px', color: 'black', fontWeight: 'bold' }}>
          {time}
        </p>

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkincheckout" element={<CheckInCheckOut />} />
          <Route path="/admin" element={<AdminUpdate />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
