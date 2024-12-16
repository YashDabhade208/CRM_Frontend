import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DNA } from 'react-loader-spinner';

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
                setIsLoading(false)
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
        <div className="p-6 pt-8">
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
                // Display doctor cards if data is successfully fetched
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {doctorInfo.map((doc, index) => (
                        <motion.div
                            key={index}
                            className="border-y-indigo-800 max-w-sm bg-white shadow-xl rounded-lg text-gray-900"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: index * 0.2 }}
                            whileHover={{ scale: 1.1 }}
                        >
                            <div className="rounded-t-lg h-32 overflow-hidden">
                                <img
                                    className="object-cover object-top w-full"
                                    src='https://img.freepik.com/free-vector/medicine-online_24877-49093.jpg?ga=GA1.1.872252232.1721550928&semt=ais_hybrid'
                                    alt="Default doctor"
                                />
                            </div>
                            <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
                                <img
                                    className="object-cover object-center h-32"
                                    src='https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ'
                                    alt="Doctor profile"
                                />
                            </div>
                            <div className="text-center mt-2">
                                <h2 className="font-semibold">{doc.name}</h2>
                                <p className="text-gray-500">{doc.title || "Doctor"}</p>
                            </div>
                            <ul className="py-4 mt-2 text-gray-700 flex items-center justify-around">
                                <li className="flex flex-col items-center">
                                    <span className="font-semibold">Status</span>
                                    <div>{doc.status || "Unavailable"}</div>
                                </li>
                                <li className="flex flex-col items-center">
                                    <span className="font-semibold">Specialty</span>
                                    <div>{doc.specialty || "General"}</div>
                                </li>
                            </ul>
                            <div className="p-4 border-t mx-8 mt-2">
                                {doc.status === "ACTIVE" ? (
                                    <motion.button
                                        className="w-1/2 block mx-auto rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2"
                                        onClick={() => handleAppointment(doc.doctor_id)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Book Appointment
                                    </motion.button>
                                ) : (
                                    <p className="text-red-600 text-center font-semibold">
                                        Currently, the doctor is unavailable
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DoctorCard;
