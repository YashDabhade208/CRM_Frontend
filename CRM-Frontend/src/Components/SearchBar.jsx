import React, { useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../Config/apiConfig';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    try {
      const response = await axios.get(`${BASE_URL}/searchpatient`, {
        params: { query },
      });
      const patientResults = Object.values(response.data.results[0]);
      setResults(patientResults);
      setSelectedPatient(null);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };
  
  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setResults([]);
    setQuery(`${patient.first_name}`);
  };

  return (
    <div className="p-4">
      <form onChange={handleSearch} className="mb-4">
        <input
          type="text"
          className="border rounded w-full p-2"
          placeholder="Search patients..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-2">
          Search
        </button>
      </form>

      <ul className="list-disc pl-5">
        {results.length > 0 && !selectedPatient ? (
          results.map((patient) => (
            <li
              key={patient.patient_id}
              className="cursor-pointer"
              onClick={() => handleSelectPatient(patient)}
            >
              {patient.first_name} {patient.last_name}
            </li>
          ))
        ) : (
          query && <p>No results found</p>
        )}
      </ul>

      {selectedPatient && (
        <div className="mt-4 border p-4 rounded bg-gray-100">
          <h3 className="text-lg font-bold">Patient Details</h3>
          <p className='text-lg'><strong>Name:</strong> {selectedPatient.first_name} {selectedPatient.last_name}</p>
          <p className='text-lg'><strong>Email:</strong> {selectedPatient.email || 'N/A'}</p>
          <p className='text-lg'><strong>Phone:</strong> {selectedPatient.phone}</p>
          <p className='text-lg'><strong>Gender:</strong> {selectedPatient.gender || 'N/A'}</p>
          <p className='text-lg'><strong>Address:</strong> {selectedPatient.address || 'N/A'}</p>
          <p className='text-lg'><strong>Date of Birth:</strong> {selectedPatient.dob || 'N/A'}</p>
         
        </div>
      )}
    </div>
  );
};

export default SearchBar;
