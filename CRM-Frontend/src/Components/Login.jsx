import React, { useEffect, useState } from 'react';
import {useAuth0} from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { useUser } from '../Contexts/UserContext'; // Import useUser hook
import '../Css/Login.css'


const Login = () => {
  const { user, loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { setUser ,setloggedIn} = useUser(); // Get the setUser function from context
  


   
  console.log("user",user);


  useEffect(() => {
    if (isAuthenticated && user) {
      setUser(user);
      setloggedIn(true);
      sessionStorage.setItem('userUser', JSON.stringify(user));
      navigate('/'); // Redirect after successful login
    }
  }, [isAuthenticated, user, setUser, setloggedIn, navigate]);

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
  const handleforgot=()=>{
    navigate('/forgot')
  }


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
        <button type="button" onClick={handleforgot}>Forgot Password</button>
      </form>
      {message && <p>{message}</p>}
      <button onClick={handleregister}>SIGN UP</button>
      <button onClick={e=>loginWithRedirect()}>Login With red</button>
    </>
  );
};

export default Login;
