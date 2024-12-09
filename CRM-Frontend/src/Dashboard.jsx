import React, { useEffect, useState } from 'react';
import './Css/Dashboard.css';

function Dashboard() {
    const [doctorInfo, setDoctorInfo] = useState({});
    const [isDoctorActive, setIsDoctorActive] = useState(false);
    const [appointments, setAppointments] = useState([]);

    const toggleDoctorStatus = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/toggledoctor/1`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                setIsDoctorActive((prevState) => !prevState);
            } else {
                console.error("Error toggling doctor status");
            }
        } catch (error) {
            console.error("Error toggling doctor status", error);
        }
    };

    const fetchDoctorInfo = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/getdoctors/1`);
            if (response.ok) {
                const result = await response.json();
                setDoctorInfo(result.data);
                setIsDoctorActive(result.data.status === 'Active');
            } else {
                console.error("Error fetching doctor information");
            }
        } catch (error) {
            console.error("Error fetching doctor information", error);
        }
    };

    const fetchAppointments = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/getappointments`);
            if (response.ok) {
                const result = await response.json();
                setAppointments(result.data);
            } else {
                console.error("Error fetching appointments");
            }
        } catch (error) {
            console.error("Error fetching appointments", error);
        }
    };

    const completeAppointment = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/completeappointment/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                setAppointments((prevAppointments) =>
                    prevAppointments.map((appointment) =>
                        appointment.appointment_id === id
                            ? { ...appointment, status: 'COMPLETED' }
                            : appointment
                    )
                );
            } else {
                console.error("Error completing appointment");
            }
        } catch (error) {
            console.error("Error completing appointment", error);
        }
    };

    useEffect(() => {
        fetchDoctorInfo();
        fetchAppointments();
    }, []);

    return (
        <div className="leaderboard">
            <header className="leaderboard__header">
                <div className="leaderboard__title">
                    <span className="leaderboard__title--top">Doctor's Dashboard</span>
                    <span className="leaderboard__title--bottom">Appointments</span>
                </div>
            </header>

            <div className="doctor-info leaderboard__profiles">
                <div className="leaderboard__profile">
                    <div className="leaderboard__name">
                        <strong>Name:</strong> {doctorInfo.name} <br />
                        <strong>Status:</strong> <span className={isDoctorActive ? 'active' : 'inactive'}>
                            {isDoctorActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                    <button
                        onClick={toggleDoctorStatus}
                        className={`status-toggle-button ${isDoctorActive ? 'active-btn' : 'inactive-btn'}`}
                    >
                        {isDoctorActive ? 'Deactivate' : 'Activate'}
                    </button>
                </div>
            </div>

            <div className="appointments leaderboard__profiles">
                <h2 className="leaderboard__title">Appointments</h2>
                <ul>
                    {appointments.map((appointment) => (
                        <li key={appointment.appointment_id}>
                            <div className="leaderboard__name">
                                <strong>ID:</strong> {appointment.appointment_id} <br />
                                <strong>Patient ID:</strong> {appointment.patient_id} <br />
                                <strong>Status:</strong> {appointment.status} <br />
                                <strong>Time:</strong> {new Date(appointment.appointment_time).toLocaleString()}
                            </div>
                            {appointment.status !== 'COMPLETED' && (
                                <button
                                    className="status-toggle-button active-btn"
                                    onClick={() => completeAppointment(appointment.appointment_id)}
                                >
                                    Mark as Complete
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Dashboard;
