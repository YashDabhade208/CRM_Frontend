import React, { useState, useEffect } from 'react';
import './Appointments.css';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Fetch appointments from the API
  useEffect(() => {
    const fetchAppointments = async ()=>{
            const res =await fetch('http://localhost:3000/api/getappointments');

            if(!res.ok){
                throw new error;
                console.log("kldgnb");
                
            }
            else{
                const results = await  res.json();
                console.log(res);
                
                setAppointments(results);
            }
    }
    fetchAppointments();
  }, []);

  // Book a selected slot
  const bookSlot = async (appointmentId) => {
    try {
      const response = await axios.post(`/api/appointments/book/${appointmentId}`); // Replace with your booking endpoint
      if (response.status === 200) {
        alert("Slot booked successfully!");
        setAppointments(appointments.map((app) =>
          app.appointment_id === appointmentId
            ? { ...app, status: "completed" } // Update status in local state
            : app
        ));
      }
    } catch (error) {
      console.error("Error booking the slot:", error);
      alert("Failed to book the slot.");
    }
  };

  return (
    <div className="appointments">
      <h2>Appointment Slots</h2>
      <div className="appointments-grid">
        {appointments.map((appointment) => (
          <div
            key={appointment.appointment_id}
            className={`appointment-slot ${appointment.status === "completed" ? "booked" : "available"}`}
            onClick={() => appointment.status !== "completed" && setSelectedSlot(appointment.appointment_id)}
          >
            <p>Date: {appointment.appointment_date}</p>
            <p>Time: {appointment.appointment_time}</p>
            <p>Status: {appointment.status}</p>
          </div>
        ))}
      </div>
      {selectedSlot && (
        <button onClick={() => bookSlot(selectedSlot)} className="book-button">
          Book Selected Slot
        </button>
      )}
    </div>
  );
};

export default Appointments;
