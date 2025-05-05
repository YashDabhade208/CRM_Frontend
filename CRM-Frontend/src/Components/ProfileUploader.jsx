import React, { useState } from 'react';
import axios from 'axios';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import BASE_URL from '../../Config/apiConfig';
import { useNavigate, useParams } from 'react-router-dom';

const ProfileUploader = () => {
  const [imageId, setImageId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  const handleUpload = async (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      setErrorMsg('');
      const res = await axios.post(`${BASE_URL}/upload`, formData);
      const { url, public_id } = res.data;

      setImageId(public_id);
      setPreviewUrl(url);

      // Save to user profile
      const token = sessionStorage.getItem('jwtToken');
      await axios.put(
        `${BASE_URL}/update-profile-image`,
        { profileImage: url, user_id: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMsg('Profile picture updated!');
      setTimeout(() => navigate('/userdashboard'), 1500); // Redirect after success
    } catch (err) {
      console.error('Upload failed:', err);
      setErrorMsg('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cld = new Cloudinary({ cloud: { cloudName: 'dmucspb11' } });
  const transformedImg = imageId
    ? cld.image(imageId).format('auto').quality('auto').resize('fill').width(300).height(300)
    : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-4">Upload Profile Picture</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="mb-4"
        />

        {transformedImg && (
          <div className="mb-4">
            <AdvancedImage cldImg={transformedImg} className="rounded-full mx-auto" />
          </div>
        )}

        <button
          className={`w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled
        >
          {loading ? 'Uploading...' : 'Upload & Save'}
        </button>

        {successMsg && <p className="mt-4 text-green-600">{successMsg}</p>}
        {errorMsg && <p className="mt-4 text-red-600">{errorMsg}</p>}
      </div>
    </div>
  );
};

export default ProfileUploader;
