// src/components/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gray-50">
      {/* Navigation Bar */}
      <nav className="w-full bg-blue-500 shadow py-4 px-8 flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">Appointment Booking</h1>
        <div>
          <button
            onClick={() => navigate('/login')}
            className="bg-white text-blue-500 px-4 py-2 rounded-lg shadow hover:bg-gray-100 mr-2"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-blue-500 px-4 py-2 rounded-lg shadow hover:bg-gray-100"
          >
            Register
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center text-center flex-grow">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to the Appointment Booking System
        </h2>
        <p className="text-gray-600 max-w-lg mb-6">
          Book appointments with your preferred doctors at your convenience. Effortless scheduling, hassle-free experience.
        </p>
        <div>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition-all mr-4"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition-all"
          >
            Register
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 w-full py-4 text-center text-gray-400">
        <p>© 2024 Appointment Booking. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
