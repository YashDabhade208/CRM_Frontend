import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../Contexts/UserContext";
import BASE_URL from '../../Config/apiConfig';
import { DNA } from 'react-loader-spinner';

const EditProfile = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [patientData, setPatientData] = useState([]);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();
  const [id, setId] = useState(0);
  const [formData, setFormData] = useState({
    patient: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    address: '',
    user_id: ''
  });
  const token = sessionStorage.getItem("jwtToken")
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${BASE_URL}/updatepatient/${formData.patient}`,
        {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          dob: formData.dob,
          gender: formData.gender,
          address: formData.address,
          user_id: formData.user_id
        },
        {
          headers: { "Authorization": `Bearer ${token}` }
        }
      );

      if (response.status === 200) {
        alert('Profile updated successfully');
        navigate('/userdashboard'); // or wherever you want to redirect after success
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };

  const fetchUserID = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${BASE_URL}/getuserid`, { email },
        { headers: { "Authorization": `Bearer ${token}` } }

      );

      if (response.status === 200) {
        const { result } = await response.data;
        setId(result.id);
        console.log(result);
      } else {
        throw new Error("Error fetching user ID");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchPatients = async () => {
      try {
        const response = await axios.post(`${BASE_URL}/getpatientbyuserid`, {
          id,
        }, { headers: { "Authorization": `Bearer ${token}` } });
        if (response.status === 200) {
          const { result } = response.data;
          setPatientData(result);
          setIsLoading(false);
          console.log(result);
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (id) {
      fetchPatients();
    }
  }, [id, token]);
  
  console.log(patientData, "patientData from edit profile");

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (email) {
      fetchUserID();
    }
  }, [email]);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Edit Profile</h2>

      {isLoading ? (
        <DNA visible={true} height="80" width="80" />
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Patient Dropdown */}
          <div className="mb-4">
            <label htmlFor="patient" className="block text-lg font-medium text-gray-700">Select Patient</label>
            <div className="relative">
              <select
                name="patient"
                value={formData.patient}
                onChange={(e) => {
                  handleChange(e);
                  const selectedPatient = patientData.find(patient => patient.patient_id.toString() === e.target.value);
                  if (selectedPatient) {
                    setFormData({
                      ...formData,
                      patient: selectedPatient.patient_id,
                      first_name: selectedPatient.first_name,
                      last_name: selectedPatient.last_name,
                      email: selectedPatient.email || '',
                      phone: selectedPatient.phone,
                      dob: selectedPatient.dob ? selectedPatient.dob.split('T')[0] : '',
                      gender: selectedPatient.gender.toLowerCase(),
                      address: selectedPatient.address,
                      user_id: selectedPatient.user_id
                    });
                  }
                }}
                id="patient"
                className="w-full mt-2 p-2 border border-gray-300 rounded-md 
                           appearance-none bg-white 
                           text-base sm:text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           cursor-pointer"
              >
                <option value="" className="text-gray-500">Select Patient</option>
                {patientData.map((patient) => (
                  <option 
                    key={patient.patient_id} 
                    value={patient.patient_id}
                    className="py-2"
                  >
                    {patient.first_name} {patient.last_name}
                  </option>
                ))}
              </select>
              {/* Add a custom dropdown arrow */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          {/* First Name */}
          <div className="mb-4">
            <label htmlFor="first_name" className="block text-lg font-medium text-gray-700">First Name</label>
            <div className="relative">
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                id="first_name"
                className="w-full mt-2 p-2 pl-10 border border-gray-300 rounded-md"
                placeholder="Enter first name"
              />
            </div>
          </div>

          {/* Last Name */}
          <div className="mb-4">
            <label htmlFor="last_name" className="block text-lg font-medium text-gray-700">Last Name</label>
            <div className="relative">
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                id="last_name"
                className="w-full mt-2 p-2 pl-10 border border-gray-300 rounded-md"
                placeholder="Enter last name"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                id="email"
                className="w-full mt-2 p-2 pl-10 border border-gray-300 rounded-md"
                placeholder="Enter email"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label htmlFor="phone" className="block text-lg font-medium text-gray-700">Phone</label>
            <div className="relative">
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                id="phone"
                className="w-full mt-2 p-2 pl-10 border border-gray-300 rounded-md"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div className="mb-4">
            <label htmlFor="dob" className="block text-lg font-medium text-gray-700">Date of Birth</label>
            <div className="relative">
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                id="dob"
                className="w-full mt-2 p-2 pl-10 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Gender */}
          <div className="mb-4">
            <label htmlFor="gender" className="block text-lg font-medium text-gray-700">Gender</label>
            <div className="relative">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                id="gender"
                className="w-full mt-2 p-2 pl-10 border border-gray-300 rounded-md"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div className="mb-4">
            <label htmlFor="address" className="block text-lg font-medium text-gray-700">Address</label>
            <div className="relative">
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                id="address"
                className="w-full mt-2 p-2 pl-10 border border-gray-300 rounded-md"
                placeholder="Enter address"
              />
            </div>
          </div>

          {/* User ID */}
          {/* <div className="mb-4">
            <label htmlFor="user_id" className="block text-lg font-medium text-gray-700">User ID</label>
            <div className="relative">
              <input
                type="text"
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                id="user_id"
                className="w-full mt-2 p-2 pl-10 border border-gray-300 rounded-md"
                placeholder="Enter user ID"
              />
            </div>
          </div> */}

          {/* Update Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-md"
            >
              Update
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditProfile;
