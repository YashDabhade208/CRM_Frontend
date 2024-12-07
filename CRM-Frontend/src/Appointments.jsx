import React, { useState } from "react";
import axios from "axios";

const Appointments = () => {
  const [formData, setFormData] = useState({
    patient_id: "",
    name: "",
    appointment_time: "",
    status: "PENDING",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/appointments", formData);
      setMessage("Appointment successfully booked!");
      console.log(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "An error occurred while booking the appointment."
      );
      console.error(error);
    }
  };

  return (
    <div className="appointment-container">
      <h2>Book an Appointment</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="patient_id">Patient ID:</label>
          <input
            type="text"
            id="patient_id"
            name="patient_id"
            value={formData.patient_id}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="name">Doctor Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="appointment_time">Appointment Time:</label>
          <input
            type="datetime-local"
            id="appointment_time"
            name="appointment_time"
            value={formData.appointment_time}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Scheduled">Scheduled</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <button type="submit">Book Appointment</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Appointments;