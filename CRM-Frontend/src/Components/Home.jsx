import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useUser } from "../Contexts/UserContext";
import { useAuth0 } from "@auth0/auth0-react";


const Home = () => {
  const navigate = useNavigate();
  const { setUser ,setloggedIn} = useUser();
  const { loginWithRedirect, isAuthenticated, isLoading, logout, user } = useAuth0();


  useEffect(() => {
      if (isAuthenticated && user) {
        // Auth0 login detected
        setUser(user); 
        console.log(user,"l");
        
        setloggedIn(true); // Explicitly set loggedIn to true
        console.log("state updated");
       // sessionStorage.setItem("userUser", JSON.stringify(user));
        navigate("/"); // Redirect after successful login
      }
    }, [isAuthenticated, user, setUser, navigate]);
    


  useEffect(() => {
    const registerUser = async () => {
      if (isAuthenticated && user) {
        try {
          const { email, name } = user;
          const response = await axios.post("http://localhost:3000/api/register", {
            name,
            email,
            password: null, // Assuming password is not required for Auth0 users
          });
          console.log("Registration successful:", response.data.message);
        } catch (error) {
          console.error("Registration failed:", error.response?.data?.message || error.message);
        }
      }
    };

    registerUser();
  }, [isAuthenticated, user]);
 
  

  return (
    <div className="mx-auto px-4 sm:px-6 text-center">
      <p className="mx-auto -mt-4 max-w-2xl text-lg tracking-tight text-slate-700 sm:mt-6">
        Welcome to{" "}
        <span className="border-b border-dotted border-slate-300">XYZ</span>
      </p>

      <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
        <span className="inline-block">
          Book{" "}
          <span className="relative whitespace-nowrap text-blue-600">
            <svg
              aria-hidden="true"
              viewBox="0 0 418 42"
              className="absolute top-2/3 left-0 h-[0.58em] w-full fill-blue-300/70"
              preserveAspectRatio="none"
            />
            <span className="relative">Appointments</span>
          </span>
        </span>{" "}
        <span className="inline-block">Online</span>
      </h1>

      <p className="mx-auto mt-9 max-w-2xl text-lg tracking-tight text-slate-700 sm:mt-6">
        <span className="inline-block">
          Save time spent on coordinating appointments over the phone
        </span>
        <span className="inline-block">Accept online bookings 24x7</span>
      </p>

      <div className="mt-12 flex flex-col justify-center gap-y-5 sm:mt-10 sm:flex-row sm:gap-y-0 sm:gap-x-6">
        {/* Book Appointment Button */}
        <div className="relative inline-flex group">
          <div className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
          <Link
            to="/doctorCard"
            title="Get quote now"
            className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            role="button"
          >
            Book Appointment now
          </Link>
        </div>
        
      </div>
      <br />
      <div className="relative inline-flex group">
          <div className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
          <Link
            to="/patientregistration"
            title="Get quote now"
            className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            role="button"
          >
            Register Patient
          </Link>
        </div>
    </div>
  );
};

export default Home;
