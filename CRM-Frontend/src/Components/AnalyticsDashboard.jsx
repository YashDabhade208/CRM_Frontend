import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import axios from 'axios';
import BASE_URL from '../../Config/apiConfig';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsDashboard = () => {
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [slotData, setSlotData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [monthlyAppointments, setMonthlyAppointments] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    day: new Date().getDate(),
    view: 'month'
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = sessionStorage.getItem('jwtToken');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        // Get appointments for specific date
        const appointmentsResponse = await axios.post(
          `${BASE_URL}/getappointmentsbydate`, 
          { 
            ...config,
            params: {
              appointment_date: new Date(selectedDate.year, selectedDate.month - 1, selectedDate.day)
                .toISOString()
                .split('T')[0]
            }
          }
        );
        setAppointmentsData(appointmentsResponse.data || []);

        // Get slot analytics for month and year
        const slotResponse = await axios.post(
          `${BASE_URL}/slotanalytics`, 
          { 
            ...config,
            params: {
              month: selectedDate.month,
              year: selectedDate.year
            }
          }
        );
        setSlotData(slotResponse.data || []);

        // Get revenue data (no parameters needed as per backend)
        // In your useEffect
const revenueResponse = await axios.get(
  `${BASE_URL}/getrevenue`, 
  config
);
setRevenueData(revenueResponse.data.result); // The whole response object including the result array

        // Get monthly revenue with correct request format
        const monthlyRevenueResponse = await axios.post(
          `${BASE_URL}/getmonthlyrevenue`, 
          {
            month: selectedDate.month.toString(),
            year: selectedDate.year.toString()
          },
          config
        );
        
        // Handle the response format correctly
        const monthlyRevenueResult = monthlyRevenueResponse.data.result;
        setMonthlyRevenue(monthlyRevenueResult[0]?.total_monthly_revenue || 0);

        // Get monthly appointments
        const monthlyAppointmentsResponse = await axios.post(
          `${BASE_URL}/getmonthlyappointments`, 
          { 
            ...config,
            params: {
              month: selectedDate.month,
              year: selectedDate.year
            }
          }
        );
        setMonthlyAppointments(monthlyAppointmentsResponse.data[0]?.total_appointments || 0);

        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
        setSlotData([]);
        setRevenueData([]);
        setMonthlyRevenue(0);
        setMonthlyAppointments(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  // Handler for date selection changes
  const handleViewChange = (e) => {
    setSelectedDate(prev => ({
      ...prev,
      view: e.target.value
    }));
  };

  const handleDateChange = (e) => {
    const date = new Date(e.target.value);
    setSelectedDate(prev => ({
      ...prev,
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      day: date.getDate()
    }));
  };

  // Chart data configuration with empty state handling
  const slotChartData = {
    labels: Array.isArray(slotData) ? slotData.map(slot => `${slot.start_time} - ${slot.end_time}`) : [],
    datasets: [{
      label: 'Booked Slots',
      data: Array.isArray(slotData) ? slotData.map(slot => slot.booked_slots) : [],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }],
  };

  const revenueChartData = {
    labels: Array.isArray(revenueData) ? revenueData.map(revenue => revenue.date.split('T')[0]) : [],
    datasets: [{
      label: 'Daily Revenue',
      data: Array.isArray(revenueData) ? revenueData.map(revenue => revenue.total_revenue) : [],
      borderColor: 'rgba(153, 102, 255, 1)',
      backgroundColor: 'rgba(153, 102, 255, 0.2)',
      borderWidth: 2,
      tension: 0.4,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value}`
        }
      }
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Loading analytics data...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Doctor Analytics Dashboard</h1>

      {/* Date Selection Controls */}
      <div style={{ marginBottom: '20px' }}>
        <select 
          value={selectedDate.view}
          onChange={handleViewChange}
          style={{ marginRight: '10px', padding: '5px' }}
        >
          <option value="day">Daily</option>
          <option value="month">Monthly</option>
          <option value="year">Yearly</option>
        </select>

        <input
          type="date"
          onChange={handleDateChange}
          style={{ padding: '5px' }}
        />
      </div>

      {/* Monthly Revenue and Appointments */}
      <div style={{ marginBottom: '20px' }}>
        <h2>Monthly Overview</h2>
        <p>Total Revenue: ${monthlyRevenue || 0}</p>
        <p>Total Appointments: {monthlyAppointments || 0}</p>
      </div>

      {/* Slot Utilization Bar Chart */}
      <div style={{ marginBottom: '40px', height: '400px' }}>
        <h2>Slot Utilization</h2>
        {Array.isArray(slotData) && slotData.length > 0 ? (
          <Bar data={slotChartData} options={chartOptions} />
        ) : (
          <div style={{ 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <p>No slot data available for the selected period</p>
          </div>
        )}
      </div>

      {/* Revenue Trends Line Chart */}
      <div style={{ height: '400px' }}>
        <h2>Revenue Trends</h2>
        {true ? (
          <Line data={revenueChartData} options={chartOptions} />
        ) : (
          <div style={{ 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <p>No revenue data available for the selected period</p>
          </div>
        )}
      </div>

      {error && (
        <div style={{ 
          padding: '10px', 
          marginTop: '20px', 
          backgroundColor: '#fee', 
          color: '#c00',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;