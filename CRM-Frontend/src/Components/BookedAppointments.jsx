import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, Clock, User, ChevronDown, ChevronUp } from "lucide-react";

const BookedAppointments = ({ id: propId }) => {
  const [id, setId] = useState(propId || 0);
  const [appointments, setAppointments] = useState([]);
  const [patientData, setPatientData] = useState([]);
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    setId(propId);
  }, [propId]);

  const token =  sessionStorage.getItem('jwtToken');  // Get token from sessionStorage
  

  const fetchAppointments = async () => {
    try {
      const response = await axios.post(
        "BASE_URLgetappointmentsbyuserid",
        { id}, {headers: {
          "Authorization": `Bearer ${token}`,
      }}
      );
      
      
      const result = response.data.data

      console.log(response.data.data);
      
     

      if (result) {
        setAppointments(result);
       // setPatientData(patients);
        setMessage("");
      } else {
        setAppointments([]);
        setMessage("No appointments found.");
      }
    } catch (error) {
      setAppointments([]);
      setMessage(
        error.response?.data?.message || "Failed to fetch appointments."
      );
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [id]);

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-300 text-green-700";
      case "CONFIRMED":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const findPatient = (appointmentId) => {
    return patientData.find((patient) => patient.appointment_id === appointmentId);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="border rounded-lg shadow-sm bg-white">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 flex items-center justify-between text-left bg-gray-50 hover:bg-gray-100 rounded-t-lg"
        >
          <span className="text-lg font-semibold text-gray-800">
            Booked Appointments
          </span>
          {isOpen ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>

        {isOpen && (
          <div className="p-4">
            {appointments.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {appointments.map((appointment) => {
                  const patient = findPatient(appointment.appointment_id);
                  return (
                    <div
                      key={appointment.appointment_id}
                      className="bg-white rounded-lg border shadow-sm p-4 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {appointment.status}
                        </span>
                        <span className="text-sm text-gray-500">
                          ID: {appointment.appointment_id}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <User className="w-4 h-4 mr-2" />
                          <span>
                            Patient: {appointment.first_name} {appointment.last_name}
                            
                          </span>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{formatDate(appointment.appointment_date)}</span>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{formatTime(appointment.appointment_time)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">{message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookedAppointments;
