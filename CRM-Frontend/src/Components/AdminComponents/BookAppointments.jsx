import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar';
import { SearchIcon, PlusCircleIcon, CalendarIcon, DownloadIcon } from 'lucide-react';

const BookAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [totalAppointments, setTotalAppointments] = useState(0);

  const fetchAppointments = async (currentPage) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/getallappointmentdata?page=${currentPage}&limit=${limit}`);
      const data = await response.json();
      if (data.success) {
        setAppointments(data.data);
        setTotalAppointments(data.total || 0); // You can modify backend to send `total`
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments(page);
  }, [page]);

  const handleNext = () => {
    setPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      
      <div className="flex-1 p-6 md:p-8 bg-gray-50">
        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search appointments..."
            className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <SearchIcon className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            <PlusCircleIcon className="h-5 w-5" />
            Book Appointment Offline
          </button>
          <button className="flex items-center justify-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
            <CalendarIcon className="h-5 w-5" />
            View Calendar
          </button>
          <button className="flex items-center justify-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
            <DownloadIcon className="h-5 w-5" />
            Export Report
          </button>
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 text-center">Loading...</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Patient ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Doctor ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {appointments.map((appointment) => (
                    <tr key={appointment.appointment_id}>
                      <td className="px-6 py-4 text-sm text-gray-800">{appointment.patient_id}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{appointment.doctor_id}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{appointment.appointment_date.slice(0, 10)}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{appointment.appointment_time}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{appointment.status}</td>
                      <td className="px-6 py-4 text-sm">
                        <button className="text-blue-600 hover:text-blue-800 mr-4">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Page {page} {/* Optional: you can show result range like "Showing 1-10 of 30" */}
            </div>
            <div className="flex gap-2">
              <button
                type='button'
                onClick={handlePrev}
                disabled={page === 1}
                className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type='button'
                onClick={handleNext}
                className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointments;
