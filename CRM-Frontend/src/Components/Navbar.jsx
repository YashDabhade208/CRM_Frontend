import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from '../Contexts/UserContext';
import {useAuth0} from '@auth0/auth0-react'
import logo from '../assets/logo.png'
import BASE_URL from '../../Config/apiConfig';

const Navbar = () => {
  const navigate = useNavigate();
  const {user,loggedin,setUser,setloggedIn} =useUser()
  const {loginWithRedirect, isAuthenticated, isLoading,logout } = useAuth0();


const handleLogout = async () => {
  try {
    // Clear session storage
    sessionStorage.removeItem("authUser");
    sessionStorage.removeItem("userUser");
    sessionStorage.removeItem("jwtToken");

    // Update state
    setUser(null);
    setloggedIn(false);
    setloggedIn(false);

  

    // Navigate to the homepage
   
   await logout()
   navigate('/')
  } catch (error) {
    console.error("Error during logout:", error);
  }
};
console.log(loggedin);

  
  return (
    <>
    <header className="fixed inset-x-0 top-0 mx-auto w-full max-w-screen-md border border-gray-100 bg-white/80 py-3 shadow backdrop-blur-lg md:top-6 md:rounded-3xl lg:max-w-screen- ">
      <div className="px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex shrink-0">
            <button
              onClick={() => navigate("/")}
              aria-label="Go to homepage"
              className="flex items-center"
            >
              <img
                className="h-10 w-auto"
                src={logo}
                alt="Logo"
              />
              <p className="sr-only">Website Title</p>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex md:items-center md:justify-center md:gap-5">
            <button
              onClick={() => navigate("/how-it-works")}
              className="inline-block rounded-lg px-2 py-1 text-sm font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
            >
              How it works
            </button>
            
          </div>

          {/* Register and Login Buttons */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => navigate("/register")}
              className="hidden items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150 hover:bg-gray-50 sm:inline-flex"
            >
              Register
            </button>
            {loggedin? <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Logout
            </button>:<button
              onClick={() => navigate("/login")}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Login
            </button>}
           
            {loggedin?<button
              onClick={() => navigate("/userdashboard")}
              className="inline-flex items-center justify-center rounded-xl bg-blue-300 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              DashBoard
            </button>:<button
              onClick={() => navigate("/login")}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              DashBoard
            </button>}
            <button
              onClick={() => navigate("/chat")}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Chat
            </button>

            
            
          </div>
        </div>
      </div>
    </header>
    </>
  );
};

export default Navbar;
