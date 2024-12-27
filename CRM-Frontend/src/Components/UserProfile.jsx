import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assuming you're using axios for API call
import { useUser } from '../Contexts/UserContext';
import { User } from 'lucide-react'; // Import the User icon from Lucide React

const UserProfile = () => {
  const { user, setUser } = useUser();
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track error state

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true); // Set loading state

        const response = await axios.get('/api/user/profile'); // Replace with your actual API endpoint
         // Update user context

      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError(error); // Set error state

      } finally {
        setIsLoading(false); // Always set loading state to false
      }
    };

    fetchUserProfile();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching user profile: {error.message}</div>; // Display error message
  }

  return (
    <div className="user-card flex-shrink-9 bg-white rounded-lg border shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
      <div >
        <h1>Welcome</h1>
        
        <User size={20} ></User>  <h3 className="text-lg font-semibold">{user.name}</h3>
       
       
      </div>
      
      {/* Add other user details as needed */}
    </div>
  );
};

export default UserProfile;