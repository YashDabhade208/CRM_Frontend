import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Ensure axios is imported
import "../Css/DoctorLogin.css";
import { useUser } from "../Contexts/UserContext";
import BASE_URL from '../../Config/apiConfig';

const DoctorLogin = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  
  const {setDoctor,isDoctorLoggedIn,setIsDoctorLoggedIn} = useUser();
  
  let doctor_id;
  
  const handleNavigation = () => {
    navigate('/Forgot');
  };
  
  const handleregister = () => {
    navigate('/doctorregistration');
  };


  

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/doctorlogin`, { name, email, password },{
        headers: {
         
         
        },
      });
      if (response.status === 200) {
        setMessage('Login successful');
        doctor_id = response.data.user.doctor_id;
        sessionStorage.setItem('jwtToken', response.data.token);
        
        
        setIsDoctorLoggedIn(true)
        console.log(response.data.user);
        
        setDoctor(response.data.user)
        navigate(`/dashboard`);
      }
    } catch (error) {
      setMessage('Login failed. Please try again.');
    }
    console.log(message); // You can remove this if you don't need to log the message
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Doctor Login</h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
        

          <div>
            <label htmlFor="email" className="block text-lg font-medium">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded p-3 mt-2"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-lg font-medium">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded p-3 mt-2"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white text-lg font-semibold px-4 py-3 rounded hover:bg-blue-700 transition duration-200"
          >
            SUBMIT
          </button>
        </form>

        {message && <p className="text-red-500 text-center mt-4">{message}</p>} 

        <button
          type="button"
          onClick={handleNavigation}
          className="w-full bg-gray-500 text-white text-lg font-semibold px-4 py-3 mt-4 rounded hover:bg-gray-600 transition duration-200"
        >
          Forgot Password
        </button>

        <button
          onClick={handleregister}
          className="w-full bg-green-600 text-white text-lg font-semibold px-4 py-3 mt-4 rounded hover:bg-green-700 transition duration-200"
        >
          SIGN UP
        </button>
      </div>
    </div>
  );
};

export default DoctorLogin;
