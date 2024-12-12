import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Forgot from "./Forgot";
import Login from "./Components/Login";
import Appointment from "./Appointments";
import Register from "./Components/Register";
import Dashboard from "./Dashboard";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import DoctorLogin from "./Components/DoctorLogin";
import UpcomingAppointment from "./Components/UpcommingAppointment";
import DoctorCard from "./Components/DoctorCard";

function App() {
  return (
    <Router>
      {/* Navbar should be outside Routes to appear globally */}
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/appointment/:doctorid" element={<Appointment />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Home />} />
        <Route path="/UpcomingAppointment" element={<UpcomingAppointment />} />
        <Route path="/doctorCard" element={<DoctorCard/>}/>
      </Routes>
    </Router>
  );
}

export default App;
