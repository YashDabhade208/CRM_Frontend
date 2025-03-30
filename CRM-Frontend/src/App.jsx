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
import { Cookie } from "lucide-react";
import PasswordReset from "./Components/PasswordReset";
import Payment from "./Components/Payment";
import ChatSupport from "./Components/ChatSupport";
import EditProfile from "./Components/EditProfile";
import './App.css'
import { Analytics } from "@vercel/analytics/react"
import SearchBar from "./Components/SearchBar";
import AnalyticsDashboard from "./Components/AnalyticsDashboard";
import PatientAnalytics from "./Components/patientAnalytics";

function App() {
  const { isDoctorLoggedIn } = useUser();
 

  return (
    <Router>
      <Analytics/>
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
            <Route path="/passwordreset/reset-password" element={<PasswordReset />} />
            <Route path="/payment/:appointmentId" element={<Payment/>} />
            <Route path="/edit-profile" element={<EditProfile/>}/>
            <Route path="/search" element={<SearchBar/>}/>
            <Route path="/chat" element={<ChatSupport/>}/>
            <Route path="/analytics" element={<AnalyticsDashboard/>}/>
            <Route path="/patientanalytics" element={<PatientAnalytics/>}/>

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
