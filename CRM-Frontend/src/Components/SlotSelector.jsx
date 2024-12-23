import React, { useEffect, useState } from "react";
import axios from "axios";

const SlotSelector = (props) => {
  const [slots, setSlots] = useState([]); // All slots from the database
  const [excludedSlots, setExcludedSlots] = useState([]); // Slots excluded from scheduling
  const [doctor_id, setDoctor_id] = useState(0);

  // Fetch the doctor_id from props
  useEffect(() => {
    setDoctor_id(props.id);
  }, [props]);

  // Fetch slots from API based on doctor_id
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await axios.post("http://localhost:3000/api/getslotsbydoctor", {
          doctor_id,
        });
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

  // Toggle slot exclusion
  const toggleSlotExclusion = (slotId) => {
    setExcludedSlots((prevExcluded) =>
      prevExcluded.includes(slotId)
        ? prevExcluded.filter((id) => id !== slotId) // Remove slotId if already excluded
        : [...prevExcluded, slotId] // Add slotId to exclusions
    );
  };

  // Submit excluded slots
  const submitExcludedSlots = async () => {
    try {
      await axios.post("http://localhost:3000/api/excludedslots", {
        excludedSlots,
      });
      alert("Excluded slots updated successfully!");
    } catch (err) {
      console.error("Error updating excluded slots:", err.message);
    }
  };

  return (
    <div>
      <h1>Slot Selector</h1>
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
            <p><strong>Doctor ID:</strong> {slot.doctor_id}</p>
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
