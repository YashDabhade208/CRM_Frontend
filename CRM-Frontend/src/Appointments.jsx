import React, { useEffect, useState } from "react";
import axios from "axios";


const Appointment = () => {

  const [formData, setFormData] = useState({
    patient_id: "",
    name: "",
    status: "PENDING",
    appointment_time: "", // Make sure this matches the initial state of the dropdown
  });
  const [message, setMessage] = useState("");
  const [slots, setSlots] = useState([]);

  const [doctor, setDoctor] = useState([]);


  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/getslots");
        if (response.status === 200) {

          setSlots(response.data.data);
          //console.log(response.data.data[0].start_time);
        }
      } catch (error) {
        console.error("Error fetching slots data", error);
        setMessage("Failed to load slots data.");
      }
    };

    fetchSlots();
  }, []);


  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/getalldoctors"
        );
        if (response.status === 200) {

          setDoctor(response.data.data);
          console.log(response.data);
        }
      } catch (error) {
        console.error("Error fetching doctor data", error);
        setMessage("Failed to load doctor data.");
      }
    };

    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDoctorChange = (e) => {
    const { value } = e.target;

    setFormData({
      ...formData,
      name: value,
    });
  };


  const handleTimeChange = (e) => {
    const { value } = e.target;
    console.log("Selected Time:", value); // Debug log

    // const formattedTime = new Date(value).toISOString().slice(0, 19).replace('T', ' ');
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

      console.log("Form Data Before Submit:", formData); // Debug log

      const response = await axios.post(
        "http://localhost:3000/api/appointments",
        formData,
        config
      );
      setMessage("Appointment successfully booked!");
      console.log("Response:", response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "An error occurred while booking the appointment."
      );
      console.error("Error:", error);
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
          <select
            id="doctorname"
            name="doctorname"
            value={formData.name}
            onChange={handleDoctorChange}
            required
          >
            <option value="">Select doctor</option>
            {doctor.map((doc, index) => (

              <option key={index} value={doc.name}>
                {doc.name}
              </option>

            ))}
          </select>
        </div>

        {slots.length > 0 ? (
          <select
            id="appointment_time"
            name="appointment_time"
            value={formData.appointment_time}
            onChange={handleTimeChange}
            required
          >
            <option value="">Select a time</option>
            {slots.map((slot, index) => (

              <option
                key={index}
                value={slot.start_time.slice(0, 19).replace("T", " ")}
              >
                {new Date(`1970-01-01T${slot.start_time}Z`).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  }
                )}{" "}
                to{" "}
                {new Date(`1970-01-01T${slot.end_time}Z`).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  }
                )}{" "}
                {slot.status}
              </option>

            ))}
          </select>
        ) : (
          <p>Loading available slots...</p>
        )}


        <button type="submit">Book Appointment</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
  //lamao dead
};

export default Appointment;

