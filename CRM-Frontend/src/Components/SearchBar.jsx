import React, { useState } from "react";
import axios from "axios";
import BASE_URL from "../../Config/apiConfig";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const token = sessionStorage.getItem("jwtToken");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const response = await axios.get(`https://crm-backend-yash208.vercel.app/searchpatient`, {
        params: { query },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setResults(response.data.results || []);
      setSelectedPatient(null);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setResults([]);
    }
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setResults([]);
    setQuery(`${patient.first_name} ${patient.last_name}`);
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg">
      {/* Search Box */}
      <form onSubmit={handleSearch} className="flex items-center gap-2 mb-4">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
          placeholder="Search patients..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
        >
          Search
        </button>
      </form>

      {/* Search Results */}
      {results.length > 0 && !selectedPatient && (
        <ul className="border rounded-lg bg-white shadow-md overflow-hidden">
          {results.map((patient) => (
            <li
              key={patient.patient_id}
              className="cursor-pointer p-3 border-b last:border-none hover:bg-blue-100 transition duration-200 flex justify-between items-center"
              onClick={() => handleSelectPatient(patient)}
            >
              <span className="text-gray-700 font-medium">
                {patient.first_name} {patient.last_name}
              </span>
              <span className="text-sm text-gray-500">{patient.phone}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Selected Patient Details */}
      {selectedPatient && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50 shadow-lg">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">Patient Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <p className="text-gray-800">
              <strong>Name:</strong> {selectedPatient.first_name} {selectedPatient.last_name}
            </p>
            <p className="text-gray-800">
              <strong>Email:</strong> {selectedPatient.email || "N/A"}
            </p>
            <p className="text-gray-800">
              <strong>Phone:</strong> {selectedPatient.phone || "N/A"}
            </p>
            <p className="text-gray-800">
              <strong>Gender:</strong> {selectedPatient.gender || "N/A"}
            </p>
            <p className="text-gray-800">
              <strong>Address:</strong> {selectedPatient.address || "N/A"}
            </p>
            <p className="text-gray-800">
              <strong>DOB:</strong>{" "}
              {selectedPatient.dob ? new Date(selectedPatient.dob).toLocaleDateString() : "N/A"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
