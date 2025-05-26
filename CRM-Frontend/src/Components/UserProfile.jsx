import React, { useState, useEffect } from 'react';
import { useUser } from '../Contexts/UserContext';
import { User, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../Config/apiConfig'; // adjust path if needed

const UserProfile = ({ id: propId }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);

  const id = propId || user?.id;

  useEffect(() => {
    if (!id) return;
    const fetchProfileImage = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/${id}/profile-image`);
        setProfileImage(res.data.profile_url);
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };
    fetchProfileImage();
  }, [id]);

  // Optional fallback to name-based avatar
  const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}`;
  const imageToUse = profileImage || fallbackUrl;

  return (
    <div className="flex flex-col md:flex-row items-center w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 space-y-4 md:space-y-0 md:space-x-6">
      <div
        className="flex flex-shrink-0 w-32 h-32 rounded-full overflow-hidden shadow border cursor-pointer"
        onClick={() => navigate(`/profileupload/${id}`)}
      >
        <img
          src={imageToUse}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
        <div className="flex items-center space-x-3 p-3">
          <User className="w-5 h-5 text-gray-600" />
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium text-lg">{user?.name}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3">
          <Mail className="w-5 h-5 text-gray-600" />
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-lg">{user?.email}</p>
          </div>
        </div>
      </div>

      <button
        className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        onClick={() => navigate('/edit-profile')}
      >
        Edit Profile
      </button>
    </div>
  );
};

export default UserProfile;
