import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Forgot from "./Forgot";

import Login from "./Login";
import Appointment from "./Appointments";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Child from "./Components/Child";
import Parent from "./Components/Parent";


function App() {
  return (
    <Router>
      {/* Navbar should be outside Routes to appear globally */}
      <Navbar />
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/forgot" element={<Forgot />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Home />} />

        <Route path="/UpcomingAppointment" element={<UpcomingAppointment />} />

      </Routes>
    </Router>
  );
}

export default App;
