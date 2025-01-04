import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useUser } from '../Contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { DNA } from 'react-loader-spinner';
import UpcomingAppointment from './UpcommingAppointment';
import AppointmentReminder from './AppointmentReminder';
import UserProfile from './UserProfile';
import BookedAppointments from './BookedAppointments';
import BASE_URL from '../../Config/apiConfig';
const UserDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [id, setId] = useState(10);
  const [email, setEmail] = useState('');
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  // Set username on mount
  useEffect(() => {
    if (user) {
      setEmail(user.email);
    }
  }, [user]);

  
  

  const token = sessionStorage.getItem("jwtToken")

  // Fetch user ID
  const fetchUserID = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${BASE_URL}/getuserid`, { email },{headers: {
        "Authorization": `Bearer ${token}`,
    }});

      if (response.status === 200) {
        const { result } = await response.data;
        setId(result.id);
        setIsLoading(false);
      } else {
        throw new Error('Error fetching user ID');
      }
    } catch (error) {
      console.error(error);
      setError('Failed to fetch user ID');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (email) {
      fetchUserID();
    }
  }, [email]);

  // Logout handler
  const handleLogout = () => {
    setUser(null); // Clear user context
    navigate('/');
  };

  return (<>
  <div className='b1'>
  <UserProfile />
  </div>
   
    <div className="p-6 mt-8">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-blue-500">Patient Dashboard</h2> 
        <p className="text-gray-600 text-center">Here you can check your upcoming appointments and more...</p>
      </div>
      <UpcomingAppointment id={id} />
      <BookedAppointments  id={id}/>
      <AppointmentReminder id={id} />
    </div>
    </>
  );
};

export default UserDashboard;