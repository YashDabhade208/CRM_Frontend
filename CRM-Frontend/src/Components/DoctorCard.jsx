import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DNA } from 'react-loader-spinner';
import { motion } from 'framer-motion';

const DoctorCard = () => {
    const [doctorInfo, setDoctorInfo] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const navigate = useNavigate();

    const fetchDoctorInfo = async (retries = 3) => {
        try {
            setError(null); // Clear previous errors
            const response = await fetch(`http://localhost:3000/api/getalldoctors`);
            if (response.ok) {
                const result = await response.json();
                setDoctorInfo(result.data);
                console.log(result.data);
                setIsLoading(false);
            } else {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
        } catch (error) {
            console.error("Error fetching doctor information", error);
            setError(error.message); // Set error message
            if (retries > 0) {
                console.log(`Retrying... (${3 - retries + 1})`);
                setTimeout(() => fetchDoctorInfo(retries - 1), 2000); // Retry after 2 seconds
            }
        } finally {
            if (retries === 0) {
                setIsLoading(false); // Stop loader after final retry
            }
        }
    };

    useEffect(() => {
        fetchDoctorInfo();
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
                        height="80"
                        width="80"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-24 sm:mt-4">
                    {doctorInfo.map((doc, index) => (
                        <div
                            key={index}
                            className={`p-4 max-w-sm mx-auto bg-white rounded-xl shadow-lg space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6 ${index === 0 ? 'mt-20' : ''}`}
                        >
                            <img
                                className="block mx-auto h-24 rounded-full sm:mx-0 sm:shrink-0"
                                src={doc.image || "https://tailwindcss.com/img/erin-lindford.jpg"}
                                alt={`${doc.name}'s face`}
                            />
                            <div className="text-center space-y-2 sm:text-left">
                                <div className="space-y-0.5">
                                    <p className="text-lg text-black font-semibold">
                                        {doc.name}
                                    </p>
                                    <p className="text-slate-500 font-medium">
                                        {doc.specialty || "General"}
                                    </p>
                                </div>
                                <p className={`font-medium ${doc.status === 'ACTIVE' ? 'text-green-500' : 'text-red-500'}`}>
                                    {doc.status || "Unavailable"}
                                </p>
                                <button className="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">
                                <motion.button
                                        className=""
                                        onClick={() => handleAppointment(doc.doctor_id)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Book Appointment
                                    </motion.button>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DoctorCard;
