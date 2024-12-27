import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Forgot from "./Components/Forgot";
import Login from "./Components/Login";
import Appointment from "./Components/Appointments";
import Register from "./Components/Register";
import Dashboard from "./Components/Dashboard";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import DoctorLogin from "./Components/DoctorLogin";
import UpcomingAppointment from "./Components/UpcommingAppointment";
import DoctorCard from "./Components/DoctorCard";
import UserDashboard from "./Components/UserDashboard";
import DoctorRegistration from "./Components/DoctorRegistration";
import PatientRegistration from "./Components/PatientRegistration";
import SlotSelector from "./Components/SlotSelector";
import { useUser } from "../src/Contexts/UserContext";
import BookedAppointments from "./Components/BookedAppointments";

function App() {
  const { isDoctorLoggedIn } = useUser();
  

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {!isDoctorLoggedIn && <Navbar />}
        <main className="flex-1 mt-20"> {/* Add top margin to account for fixed navbar */}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot" element={<Forgot />} />
            <Route path="/appointment/:doctorid" element={<Appointment />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Home />} />
            <Route path="/upcomingappointment" element={<UpcomingAppointment />} />
            <Route path="/bookedappointments" element={<BookedAppointments />} />
            <Route path="/doctorcard" element={<DoctorCard />} />
            <Route path="/doctorlogin" element={<DoctorLogin />} />
            <Route path="/userdashboard" element={<UserDashboard />} />
            <Route path="/doctorregistration" element={<DoctorRegistration />} />
            <Route path="/patientregistration" element={<PatientRegistration />} />
            <Route path="/slotselector" element={<SlotSelector />} />
            <Route path="*" element={<Home />} /> {/* Handle undefined routes */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
