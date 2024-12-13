import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { useUser } from '../Contexts/UserContext'; // Import useUser hook
import '../Css/Login.css'

const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { setUser ,setloggedIn} = useUser(); // Get the setUser function from context

  const handleNavigation = () => {
    navigate('/Forgot');
  };

  const handleregister = () => {
    navigate('/register');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/login', { name, email, password });
      if (response.status === 200) {
        setMessage('Login successful');
        sessionStorage.setItem('jwtToken', response.data.token);
        setUser(response.data.result.user); // Store user data in context
        setloggedIn(true)
        navigate('/'); // Navigate after successful login
      }
    } catch (error) {
      setMessage('Login failed. Please try again.');
    }
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
        <button type="button" onClick={handleNavigation}>Forgot Password</button>
      </form>
      {message && <p>{message}</p>}
      <button onClick={handleregister}>SIGN UP</button>
    </>
  );
};

export default Login;
