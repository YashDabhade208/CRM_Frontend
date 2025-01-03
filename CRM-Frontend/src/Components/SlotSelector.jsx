import React, { useEffect, useState } from "react";
import axios from "axios";

const SlotSelector = (props) => {
  const [slots, setSlots] = useState([]);
  const [excludedSlots, setExcludedSlots] = useState([]);
  const [doctor_id, setDoctor_id] = useState(0);
  const [date, setDate] = useState('');
  // Add new state for success message
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setDoctor_id(props.id);
  }, [props]);


  const token = sessionStorage.getItem("jwtToken")
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await axios.post("${BASE_URL}/getslotsbydoctor", {
          doctor_id,
        },{headers: {
          "Authorization":`Bearer ${token}`,
          "Content-Type": "application/json",
        }},);
        setSlots(response.data.data);
        console.log(response.data.data);
      } catch (err) {
        console.error("Error fetching slots:", err.message);
      }
    };

    if (doctor_id) {
      fetchSlots();
    }
  }, [doctor_id]);

  const toggleSlotExclusion = (slotId) => {
    setExcludedSlots((prevExcluded) =>
      prevExcluded.includes(slotId)
        ? prevExcluded.filter((id) => id !== slotId)
        : [...prevExcluded, slotId]
    );
  };

  const handleDate = (e) => {
    setDate(e.target.value);
  }

  const scheduleobj = { doctor_id, excludedSlots, date }

  const submitExcludedSlots = async () => {
    try {
      // Validate only the essential fields
      if (!date) {
        alert("Please select a date");
        return;
      }
  
      if (!doctor_id) {
        alert("Doctor ID is missing");
        return;
      }
  
      // Log the request payload for debugging
      console.log("Sending request with data:", scheduleobj);
    

  
      const response = await axios.post("${BASE_URL}/setschedule", scheduleobj,{
        headers: {
          "Authorization":`Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      // Log the response for debugging
      console.log("Server response:", response.data);
  
      // Show success message
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
  
    } catch (err) {
      // Enhanced error handling
      const errorMessage = err.response?.data?.message || err.message;
      console.error("Error details:", {
        message: errorMessage,
        status: err.response?.status,
        data: err.response?.data
      });
  
      // Show error to user
      alert(`Failed to update schedule: ${errorMessage}`);
    }
  };

  return (
    <div>
      <header className="text-center">
        <h3 className="text-2xl font-bold text-gray-800">Slot Selector</h3>
        <p className="text-gray-600">Schedule time slots for upcoming days</p>
      </header>

      {/* Success message */}
      {showSuccess && (
        <div 
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '15px',
            borderRadius: '5px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            zIndex: 1000,
            animation: 'slideIn 0.5s ease-out'
          }}
        >
          Schedule updated successfully!
        </div>
      )}

      {/* Add CSS for animation */}
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>

      <div>
        <div>
          Schedule Date:
          <input
            type="date"
            id="Schedule_date"
            name="Schedule_date"
            value={date}
            onChange={handleDate}
            required
            className="p-2 border rounded-md"
          />
        </div>
      </div>
      <br />
      <br />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {slots.map((slot) => (
          <div
            key={slot.slot_id}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: excludedSlots.includes(slot.slot_id)
                ? "2px solid red"
                : "2px solid green",
              backgroundColor: excludedSlots.includes(slot.slot_id)
                ? "#ffcccc"
                : "#ccffcc",
              cursor: "pointer",
              width: "200px",
              textAlign: "center",
            }}
          >
            <p><strong>Slot ID:</strong> {slot.slot_id}</p>
            <p><strong>Time:</strong> {slot.start_time} - {slot.end_time}</p>
            <p><strong>Capacity:</strong> {slot.capacity}</p>
            <button
              onClick={() => toggleSlotExclusion(slot.slot_id)}
              style={{
                padding: "5px 10px",
                backgroundColor: excludedSlots.includes(slot.slot_id)
                  ? "#ff0000"
                  : "#00ff00",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {excludedSlots.includes(slot.slot_id) ? "Include" : "Exclude"}
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={submitExcludedSlots}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Submit Exclusions
      </button>
    </div>
  );
};

export default SlotSelector;