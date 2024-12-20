import React, { useEffect, useState } from "react";
import axios from "axios";

const UpcomingAppointment = (props) => {
  const [id, setId] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");

useEffect(()=>{
  setId(props.id)
  ;
  
},[])


   
  const fetchAppointments = async (retries = 3) => {
      try {
      const response = await axios.post(
        "http://localhost:3000/api/upcomingappointments",
        { id }
      );
      const result = response.data?.result;
      if (result && result.length > 0) {
        setAppointments(result);
        setMessage("");
      } else {
        setAppointments([]);
        setMessage("No appointments found.");
      }
    } catch (error) {
      console.error(error);
      setError(error.message);
      if (retries > 0) {
        console.log(`Retrying...(${3 - retries + 1})`);
        setTimeout(() => fetchAppointments(retries - 1), 2000); // Retry after 2 seconds
      }
    } finally {
      if (retries === 0) {
        setIsLoading(false);
      }
  };
}
  useEffect(()=>{
    fetchAppointments()
  },[id])

  return (
    <div className="w-full max-w-5xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-5">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-5">
        Upcoming Appointments
      </h2>

      {/* Form Section */}
      

      {/* Message Section */}
      {message && <p className="text-red-500 text-center mb-5">{message}</p>}

      {/* Appointments Section */}
      {appointments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.appointment_id}
              className="p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                Appointment ID: {appointment.appointment_id}
              </h3>
              <p className="text-sm text-gray-600">
                <strong>Time:</strong> {appointment.appointment_time}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Status:</strong> {appointment.status}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Doctor ID:</strong> {appointment.doctor_id}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Slot ID:</strong> {appointment.slot_id}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Created At:</strong>{" "}
                {new Date(appointment.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingAppointment;