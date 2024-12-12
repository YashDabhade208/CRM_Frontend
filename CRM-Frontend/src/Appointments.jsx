import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Appointment = () => {
  const [formData, setFormData] = useState({
    patient_id: "",
    name: "",
    status: "PENDING",
    appointment_time: "",
    appointment_date: "",
  });
  const [message, setMessage] = useState("");
  const [slots, setSlots] = useState([]);
  const [doctorName, setDoctorName] = useState("");
  const { doctorid } = useParams();

  useEffect(() => {
    // Fetch slots for the doctor
    const fetchSlots = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/getslots/${doctorid}`);
        if (response.status === 200) {
          setSlots(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching slots data", error);
        setMessage("Failed to load slots data.");
      }
    };

    // Fetch doctor details
    
    fetchSlots();

  }, []);


  
  useEffect(() => {
    const fetchDoctorName = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/getalldoctors");
        if (response.status === 200) {
          const doctorData = response.data.data.find(
            (doc) => String(doc.doctor_id) === String(doctorid) // Ensure type match
          );
          if (doctorData) {
            setDoctorName(doctorData.name); // Set the state
          } else {
            console.error("Doctor not found");
            setMessage("Doctor not found.");
          }
        }
      } catch (error) {
        console.error("Error fetching doctor data", error);
        setMessage("Failed to load doctor data.");
      }
    };
  
    fetchDoctorName();
  }, [doctorid]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTimeChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      appointment_time: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await axios.post(
        "http://localhost:3000/api/appointments",
        { ...formData, name: doctorName }, // Add doctor name to formData
        config
      );
      setMessage("Appointment successfully booked!");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "An error occurred while booking the appointment."
      );
    }
  };
  console.log(doctorName);
  

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Book an Appointment</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="patient_id" className="block font-medium mb-1">
            Patient ID:
          </label>
          <input
            type="text"
            id="patient_id"
            name="patient_id"
            value={formData.patient_id}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label htmlFor="doctorname" className="block font-medium mb-1">
            Doctor:
          </label>
          <input
            type="text"
            id="doctorname"
            name="doctorname"
            value={doctorName}
            readOnly
            className="w-full p-2 border rounded-md bg-gray-100"
          />
        </div>

        <div>
          <label htmlFor="appointment_time" className="block font-medium mb-1">
            Appointment Time:
          </label>
          {slots.length > 0 ? (
            <select
              id="appointment_time"
              name="appointment_time"
              value={formData.appointment_time}
              onChange={handleTimeChange}
              required
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select a time</option>
              {slots.map((slot, index) => {
                const startTime = new Date(`1970-01-01T${slot.start_time}Z`);
                const endTime = new Date(`1970-01-01T${slot.end_time}Z`);

                const formattedStartTime = startTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                });

                const formattedEndTime = endTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                });

                return (
                  <option
                    key={index}
                    value={slot.start_time}
                  >
                    {slot.start_time} to {slot.end_time} ({slot.status})
                  </option>
                );
              })}
            </select>
          ) : (
            <p>Loading available slots...</p>
          )}
        </div>

        <div>
          <label htmlFor="appointment_date" className="block font-medium mb-1">
            Appointment Date:
          </label>
          <input
            type="date"
            id="appointment_date"
            name="appointment_date"
            value={formData.appointment_date}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Book Appointment
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 p-2 rounded-md ${
            message.includes("successfully")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Appointment;
