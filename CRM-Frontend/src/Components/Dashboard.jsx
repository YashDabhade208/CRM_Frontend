import React, { useEffect, useState } from "react";
import SlotSelector from "./SlotSelector";
import { useUser } from "../Contexts/UserContext";
import BASE_URL from '../../Config/apiConfig';
import SearchBar from "./SearchBar";
const Dashboard = () => {
  const [doctorInfo, setDoctorInfo] = useState({});
  const [isDoctorActive, setIsDoctorActive] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const { doctor, isDoctorLoggedIn, setIsDoctorLoggedIn } = useUser();
  const [doctorId, setDoctorId] = useState(0);

  useEffect(() => {
    if (doctor) {
      setDoctorInfo(doctor);
      setIsDoctorActive(doctor.status);
      setDoctorId(doctor.doctor_id);
    }
  }, [doctor]);

  const token = sessionStorage.getItem("jwtToken")

 
  
  const fetchAppointments = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getappointments`, {
        method: "POST",
        headers: {
          "Authorization":`Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: doctorId }),
      });

      if (response.ok) {
        const result = await response.json();
        setAppointments(result.data || []);
      } else {
        console.error("Error fetching appointments");
      }
    } catch (error) {
      console.error("Error fetching appointments", error);
    }
  };

  const completeAppointment = async (id) => {
    try {
      const response = await fetch(
        `${BASE_URL}/completeappointment/${id}`,
        {
          method: "POST",
          headers: {
            "Authorization":`Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment.appointment_id === id
              ? { ...appointment, status: "COMPLETED" }
              : appointment
          )
        );
      } else {
        console.error("Error completing appointment");
      }
    } catch (error) {
      console.error("Error completing appointment", error);
    }
  };

  const toggleDoctorStatus = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/toggledoctor/${doctorId}`,
        {
          method: "POST",
          headers: {
            "Authorization":`Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        setIsDoctorActive((prevState) => !prevState);
      } else {
        console.error("Error toggling doctor status");
      }
    } catch (error) {
      console.error("Error toggling doctor status", error);
    }
  };

  const handleLogout = () => {
    setIsDoctorLoggedIn(false);
    sessionStorage.removeItem('doctor')
    sessionStorage.removeItem("jwtToken")
   

  };

  useEffect(() => {
    if (doctorId) {
      fetchAppointments();
    }
  }, [doctorId]);  

  const formatTime = (timeString) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isDoctorLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
          onClick={() => window.location.href = "/doctorlogin"}
        >
          Login to Access Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header Section */}
      <button
        onClick={handleLogout}
        className="px-4 py-1 rounded-lg font-medium text-white bg-red-500 hover:bg-red-600"
      >
        Logout
      </button>
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Doctor's Dashboard</h1>
        <p className="text-gray-600">Manage your appointments effectively</p>
      </header>
      <SearchBar/>

      {/* Doctor Info Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Dr. {doctorInfo.name}
            </h2>
            <p className="text-gray-600">
              Status:{" "}
              <span
                className={`font-bold ${
                  isDoctorActive ? "text-green-500" : "text-red-500"
                }`}
              >
                {isDoctorActive ? "Active" : "Inactive"}
              </span>
            </p>
          </div>
          <button
            onClick={toggleDoctorStatus}
            className={`px-4 py-2 rounded-lg font-medium text-white ${
              isDoctorActive
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isDoctorActive ? "Deactivate" : "Activate"}
          </button>
        </div>
      </div>

      {/* Appointments Section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Appointments
        </h2>
        {appointments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((appointment) => (
              <div
                key={appointment.appointment_id}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  TOKEN NUMBER: {appointment.token_id}
                </h3>
                <p className="text-gray-600">
                  <strong>Patient ID:</strong> {appointment.patient_id}
                </p>
                <p className="text-gray-600">
                  <strong>Status:</strong> {appointment.status}
                </p>
                <p className="text-gray-600">
                  <strong>Time:</strong>{" "}
                  {formatTime(appointment.appointment_time)}
                </p>
                {appointment.status !== "COMPLETED" && (
                  <button
                    onClick={() =>
                      completeAppointment(appointment.appointment_id)
                    }
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Mark as Complete
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No appointments available</p>
        )}
      </div>

      <SlotSelector id={doctorId} />
    </div>
  );
};

export default Dashboard;
