import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useUser } from '../Contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { DNA } from 'react-loader-spinner';
import UpcomingAppointment from './UpcommingAppointment';

const UserDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [id, setId] = useState(10);
  const [email, setEmail] = useState('');
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, title: 'Step 1', description: 'Appointment Scheduled' },
    { id: 2, title: 'Step 2', description: 'Appointment Confirmed' },
    { id: 3, title: 'Step 3', description: 'Appointment Completed' },
  ];

  // Set username on mount
  useEffect(() => {
    if (user) {
      setEmail(user.email);
    }
  }, [user]);


  

  // Fetch user ID
  const fetchUserID = async () => {

    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:3000/api/getuserid', { email });
      
      
      if (response.status === 200) {
        const { result } = await response.data;
        setId(result.id);
        setIsLoading(false)
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
fetchUserID();}
  }, [email]);



  
  



 

  // Logout handler
  const handleLogout = () => {
    setUser(null); // Clear user context
    navigate('/');
  };



    return (<>

   < UpcomingAppointment id={id}/>
    
    </>


    )    

    
}

export default UserDashboard