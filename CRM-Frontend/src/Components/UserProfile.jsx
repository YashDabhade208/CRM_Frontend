import React from 'react';
import { useUser } from '../Contexts/UserContext';
import { User, Mail, IdCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EditProfile from './EditProfile';
const UserProfile = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("jwtToken");

  

  return (
    <div className="flex flex-col md:flex-row items-center w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 space-y-4 md:space-y-0 md:space-x-6">
      <div className="hidden md:flex flex-shrink-0 w-32 h-32 bg-blue-100 rounded-full items-center justify-center">
        <User className="w-16 h-16 text-blue-600" />
      </div>
      <div className="flex flex-row items-center space-x-6">
        <div className="flex items-center space-x-3 p-3">
          <User className="w-5 h-5 text-gray-600" />
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium text-lg">{user.name}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3">
          <Mail className="w-5 h-5 text-gray-600" />
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-lg">{user.email}</p>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-3 p-3">
         
         
        </div>
      </div>
      <button className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      onClick={() => navigate('/edit-profile')}
      >Edit Profile</button>
    </div>
  );
};

export default UserProfile;
