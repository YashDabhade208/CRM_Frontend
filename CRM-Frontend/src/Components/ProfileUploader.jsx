import React, { useState } from 'react';
import axios from 'axios';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import BASE_URL from '../../Config/apiConfig';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, Loader2, CheckCircle2 } from 'lucide-react';

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

      setSuccessMsg('Profile picture updated successfully!');
      setTimeout(() => navigate('/userdashboard'), 2000);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center space-y-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Update Profile Picture</h2>
        
        <div className="relative">
          <label 
            htmlFor="file-upload" 
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
          >
            {transformedImg ? (
              <div className="w-full h-full">
                <AdvancedImage cldImg={transformedImg} className="w-full h-full object-cover rounded-lg" />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-12 h-12 text-gray-400 mb-3" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 2MB)</p>
              </div>
            )}
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        </div>

        {loading && (
          <div className="flex items-center justify-center space-x-2 text-blue-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Uploading...</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <CheckCircle2 className="w-5 h-5" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="flex items-center justify-center space-x-2 text-red-600">
            <span>{errorMsg}</span>
          </div>
        )}

        <button
          onClick={() => navigate('/userdashboard')}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ProfileUploader;
