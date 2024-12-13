import React, { useEffect, useState } from "react";
import axios from "axios";

const UpcomingAppointment = () => {
  const [id, setId] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");

  const fetchAppointments = async (e) => {
    e.preventDefault();
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
      setAppointments([]);
      setMessage(
        error.response?.data?.message || "Failed to fetch appointments."
      );
    }
  };
  // useEffect(()=>{
  //   fetchAppointments
  // },[])

  return (
    <div className="w-full max-w-5xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-5">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-5">
        Upcoming Appointments
      </h2>

      {/* Form Section */}
      <form onSubmit={fetchAppointments} className="mb-5">
        <div className="mb-4">
          <label
            htmlFor="id"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Enter User ID
          </label>
          <input
            type="text"
            id="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="block w-full px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter your Patient ID"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2.5 px-4 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
        >
          Fetch Appointments
        </button>
      </form>

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
