import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Ensure axios is imported
import "../Css/DoctorLogin.css"

const DoctorLogin = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

 
  const handleNavigation = () => {
    navigate('/Forgot');
  };
  const handleregister = () => {
    navigate('/register');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/doctorlogin', { name, email, password });
      // Check if response is successful
      if (response.status === 200) {
        setMessage('Login successful');
        sessionStorage.setItem('jwtToken', response.data.token);
        navigate('/home')
         // Example: Navigate to the dashboard page after successful login
      }
    } catch (error) {
      setMessage('Login failed. Please try again.');
    }
    console.log(message); // You can remove this if you don't need to log the message
  };

  return (
    <>
    
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">SUBMIT</button>

        {/* Change to type="button" to prevent form submission */}
        <button type="button" onClick={handleNavigation}>Forgot Password</button>
      </form>
      {message && <p>{message}</p>} {/* Display message */}
      <button onClick={handleregister}>SIGN UP</button>
    </>
  );
};

export default DoctorLogin;
