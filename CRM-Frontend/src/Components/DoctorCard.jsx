import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DNA } from 'react-loader-spinner';
import { motion } from 'framer-motion';
import axios from 'axios';
import BASE_URL from '../../Config/apiConfig';

const DoctorCard = () => {
    const [doctorInfo, setDoctorInfo] = useState([]);
    const [isLoading, setIsLoading] = useState(true);  // Loading state
    const [error, setError] = useState(null);  // Error state
    
    const navigate = useNavigate();
    const token =  sessionStorage.getItem('jwtToken');  // Get token from sessionStorage
    console.log("Doctor card says: BAse url is : ", BASE_URL);
    

    const fetchDoctorInfo = async (retries = 3) => {
        try {
            setError(null);  // Clear previous errors
            if (!token) {
                throw new Error("No token found, please log in again.");
            }
            const response = await axios.get(`${BASE_URL}/getalldoctors`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            if (response.status === 200) {
                const result = await response.data;
                console.log(result);
                
                setDoctorInfo(result.data);
                setIsLoading(false);  // Stop loading after successful data fetch
            } 
        } catch (error) {
            console.error("Error fetching doctor information", error);
            setError(error.message);  // Set error message in state

            if (retries > 0) {
                console.log(`Retrying... (${3 - retries + 1})`);
                setTimeout(() => fetchDoctorInfo(retries - 1), 2000);  // Retry after 2 seconds
            } else {
                setIsLoading(false);  // Stop loader after final retry
            }
        }
    };

    useEffect(() => {
        fetchDoctorInfo();  // Initial fetch call
    }, []);

    const handleAppointment = (doctorid) => {
        navigate(`/appointment/${doctorid}`);
    };
    return (
        <div className="container mx-auto px-4 py-6 pt-6">
            {isLoading ? (
                // Show spinner during loading and retries
                <div className="flex flex-col items-center">
                    <DNA
                        visible={true}
                        height="40"
                        width="40"
                        ariaLabel="dna-loading"
                        wrapperStyle={{}}
                        wrapperClass="dna-wrapper"
                    />
                    {error && (
                        <p className="text-red-600 text-center font-semibold mt-4">
                            {error}
                        </p>
                    )}
                </div>
            ) : error ? (
                // Show error message and retry button after retries are exhausted
                <div className="text-center text-red-600 font-semibold">
                    <p>{error}</p>
                    <button
                        onClick={() => {
                            setIsLoading(true);
                            fetchDoctorInfo();
                        }}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Retry
                    </button>
                </div>
            ) : (
                // Display doctor information using doctorInfo.map
                 
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12 px-4 sm:px-6 md:px-8">
                      {doctorInfo.map((doc, index) => (
                        <div
                          key={index}
                          className="p-6 max-w-sm bg-white rounded-xl shadow-lg flex flex-col items-center space-y-4 sm:space-y-2 transition-transform transform hover:scale-105"
                        >
                          <img
                            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                            src={doc.image || "https://th.bing.com/th/id/OIP.T0nPc_C2Z0gtaD6sI1ryRQHaHp?rs=1&pid=ImgDetMain"}
                            
                          />
                          <div className="text-center">
                            <p className="text-lg font-semibold text-gray-900">{doc.name}</p>
                            <p className="text-sm text-gray-500">{doc.specialty || "General"}</p>
                            <p className={`font-medium ${doc.status === "ACTIVE" ? "text-green-500" : "text-red-500"}`}>
                              {doc.status || "Unavailable"}
                            </p>
                          </div>
                          <motion.button
                            onClick={() => handleAppointment(doc.doctor_id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 text-sm font-semibold text-purple-600 border border-purple-300 rounded-full hover:bg-purple-600 hover:text-white transition-all"
                          >
                            Book Appointment
                          </motion.button>
                        </div>
                      ))}
                    </div>
            )}
        </div>
    );
};

export default DoctorCard;
