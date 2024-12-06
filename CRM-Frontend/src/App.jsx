import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Forgot from './Forgot';
import Login from './Login';
import Appointment from './Appointments';
import Register from './Register';
import { useState } from 'react';
import Dashboard from './Dashboard';
import Home from './Components/Home';
import Child from './Components/Child';
import Parent from './Components/Parent';

function App() {
 

  return (
    <Router>
      

      <Routes>
        {/* Default route renders the Login component */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/child" element={<Child />} />
        <Route path="/parent" element={<Parent />} />

        {/* Forgot password route renders the Forgot component */}
        <Route path="/forgot" element={<Forgot />} />
        
        {/* Appointment page */}
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
