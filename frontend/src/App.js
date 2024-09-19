import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import HomePage from './pages/Homepage';
function App() {
  const [message, setMessage] = useState('');

  // useEffect(() => {
  //   // Make a request to the backend
  //   axios.get('http://localhost:3000/api')
  //     .then(response => {
  //       setMessage(response.data.message);
  //     })
  //     .catch(error => {
  //       console.error('There was an error!', error);
  //     });
  // }, []);

  return (
    <div>
      <HomePage />
    </div>
  );
}

export default App;
