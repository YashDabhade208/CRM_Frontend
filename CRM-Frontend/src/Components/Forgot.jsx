import React, { useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../Config/apiConfig';

const Forgot = () => {
  const [email, setuserEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage('Please enter your userEmail address.');
      return;
    }

    setLoading(true);
    try {
      // Send password reset userEmail request to the backend
      const response = await axios.post(`${BASE_URL}/resetpassword`, { email });

      if (response.status ===200) {
        setMessage('Password reset userEmail sent successfully! Please check your inbox.');
      } else {
        setMessage('There was an issue sending the reset userEmail. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred while sending the reset userEmail.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg mt-12">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Request Password Reset</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="userEmail" className="block text-sm font-medium text-gray-600">Enter your userEmail address</label>
          <input
            type="userEmail"
            id="userEmail"
            value={email}
            onChange={(e) => setuserEmail(e.target.value)}
            required
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {message && (
          <p className={`text-sm text-center ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          {loading ? 'Sending...' : 'Send Password Reset userEmail'}
        </button>
      </form>
    </div>
  );
};

export default Forgot;
