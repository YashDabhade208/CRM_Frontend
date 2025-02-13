import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from '../Contexts/UserContext';
import { useAuth0 } from '@auth0/auth0-react';
import logo from '../assets/logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, loggedin, setUser, setloggedIn } = useUser();
  const { loginWithRedirect, logout } = useAuth0();

  const handleLogout = async () => {
    try {
      sessionStorage.clear(); // Clear all session data
      setUser(null);
      setloggedIn(false);
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 w-full bg-white shadow-md py-3 backdrop-blur-lg z-50">
      <div className="container mx-auto px-4 lg:px-6 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => navigate("/")} className="flex items-center">
          <img className="h-10 w-auto" src={logo} alt="Logo" />
          <p className="sr-only">Website Title</p>
        </button>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-5">
          <button onClick={() => navigate("/how-it-works")} className="text-gray-900 hover:text-blue-600 transition">
            How it works
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {!loggedin && (
            <button
              onClick={() => navigate("/register")}
              className="hidden sm:inline-flex items-center rounded-lg px-3 py-2 text-sm font-semibold text-gray-900 border border-gray-300 transition hover:bg-gray-100"
            >
              Register
            </button>
          )}

          {loggedin ? (
            <button
              onClick={handleLogout}
              className="px-3 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg transition hover:bg-red-500"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-3 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg transition hover:bg-blue-500"
            >
              Login
            </button>
          )}

          <button
            onClick={() => navigate(loggedin ? "/userdashboard" : "/login")}
            className={`px-3 py-2 text-sm font-semibold text-white rounded-lg transition ${
              loggedin ? "bg-blue-400 hover:bg-blue-500" : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/chat")}
            className="px-3 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg transition hover:bg-blue-500"
          >
            Chat
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
