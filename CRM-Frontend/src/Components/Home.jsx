import React from "react";
import { useNavigate, Link } from "react-router-dom";
import DoctorCard from "./DoctorCard";


const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
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
            >
              {/* <path d="..." /> */}
            </svg>
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
        {/* Navigate to Dashboard Button */}
        {/* <button
          className="group inline-flex ring-1 items-center justify-center rounded-full py-2 px-4 text-sm focus:outline-none ring-slate-200 text-slate-700 hover:text-slate-900 hover:ring-slate-300 active:bg-slate-100 active:text-slate-600 focus-visible:outline-blue-600 focus-visible:ring-slate-300 animate-fade-in-right"
          onClick={() => navigate("/dashboard")}
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            role="img"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-3 w-3 flex-none fill-current text-blue-600"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="..." />
          </svg>
          <span className="ml-3">Dashboard</span>
        </button> */}
      </div>
    
    </div>
  );
};

export default Home;
