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
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
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
  Legend,
  ArcElement
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

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
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
        setSlotData(slotResponse.data.result || []);
        

        // Get revenue data with month and year
        const revenueResponse = await axios.post(
          `${BASE_URL}/getrevenue`, 
          {
            month: selectedDate.month.toString(),
            year: selectedDate.year.toString()
          },
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
        setMonthlyAppointments(monthlyAppointmentsResponse.data.result[0]?.total_appointments || 0);
        console.log(monthlyAppointmentsResponse.data.result);
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

  const handleMonthChange = (e) => {
    setSelectedDate(prev => ({
      ...prev,
      month: months.indexOf(e.target.value) + 1
    }));
  };

  const handleYearChange = (e) => {
    setSelectedDate(prev => ({
      ...prev,
      year: parseInt(e.target.value)
    }));
  };

  // Chart data configuration with empty state handling
  const slotChartData = {
    labels: Array.isArray(monthlyAppointments) ? monthlyAppointments.map(slot => `${slot.start_time} - ${slot.end_time}`) : [],
    datasets: [{
      label: 'Booked Slots',
      data: Array.isArray(monthlyAppointments) ? monthlyAppointments.map(slot => slot.booked_slots) : [],
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

  // Prepare data for pie chart
  const slotPieChartData = {
    labels: Array.isArray(slotData) 
      ? slotData.map(slot => `${slot.start_time} - ${slot.end_time}`)
      : [],
    datasets: [{
      data: Array.isArray(slotData) 
        ? slotData.map(slot => slot.booked_slots)
        : [],
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)',
        'rgba(199, 199, 199, 0.8)',
        'rgba(83, 102, 255, 0.8)',
        'rgba(40, 159, 64, 0.8)',
        'rgba(210, 199, 199, 0.8)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(199, 199, 199, 1)',
        'rgba(83, 102, 255, 1)',
        'rgba(40, 159, 64, 1)',
        'rgba(210, 199, 199, 1)',
      ],
      borderWidth: 1,
    }],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 15,
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} bookings (${percentage}%)`;
          }
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
    <div style={{ 
      padding: '30px',
      backgroundColor: '#f5f7fb',
      minHeight: '100vh'
    }}>
      {/* Header Section */}
      <div style={{
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{
          color: '#2c3e50',
          fontSize: '2.5rem',
          marginBottom: '20px'
        }}>Doctor Analytics Dashboard</h1>
        
        {/* Date Selection Controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '15px',
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}>
          {/* Month Selector */}
          <select 
            value={months[selectedDate.month - 1]}
            onChange={handleMonthChange}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              backgroundColor: 'white',
              fontSize: '1rem',
              cursor: 'pointer',
              minWidth: '150px',
              color: '#2c3e50',
              outline: 'none',
              transition: 'border-color 0.2s',
              ':hover': {
                borderColor: '#3498db'
              }
            }}
          >
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>

          {/* Year Selector */}
          <select 
            value={selectedDate.year}
            onChange={handleYearChange}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              backgroundColor: 'white',
              fontSize: '1rem',
              cursor: 'pointer',
              minWidth: '100px',
              color: '#2c3e50',
              outline: 'none',
              transition: 'border-color 0.2s',
              ':hover': {
                borderColor: '#3498db'
              }
            }}
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          {/* View Type Selector */}
          {/* <select 
            value={selectedDate.view}
            onChange={handleViewChange}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              backgroundColor: 'white',
              fontSize: '1rem',
              cursor: 'pointer',
              minWidth: '120px',
              color: '#2c3e50',
              outline: 'none',
              transition: 'border-color 0.2s',
              ':hover': {
                borderColor: '#3498db'
              }
            }}
          >
            <option value="day">Daily View</option>
            <option value="month">Monthly View</option>
            <option value="year">Yearly View</option>
          </select> */}
        </div>

        {/* Selected Period Display */}
        <div style={{
          backgroundColor: 'white',
          padding: '10px 20px',
          borderRadius: '20px',
          display: 'inline-block',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <p style={{
            margin: 0,
            color: '#2c3e50',
            fontSize: '1.1rem'
          }}>
            Viewing data for: <strong>{months[selectedDate.month - 1]} {selectedDate.year}</strong>
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#7f8c8d', marginBottom: '10px' }}>Monthly Revenue</h3>
          <p style={{ 
            fontSize: '2rem', 
            color: '#2ecc71', 
            fontWeight: 'bold' 
          }}>${monthlyRevenue?.toLocaleString() || 0}</p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#7f8c8d', marginBottom: '10px' }}>Total Appointments</h3>
          <p style={{ 
            fontSize: '2rem', 
            color: '#3498db', 
            fontWeight: 'bold' 
          }}>{monthlyAppointments || 0}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: '30px',
        marginBottom: '30px'
      }}>
        {/* Slot Distribution Pie Chart */}
        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          height: '500px'
        }}>
          <h2 style={{ 
            color: '#2c3e50', 
            marginBottom: '20px',
            fontSize: '1.5rem'
          }}>Slot Utilization Distribution</h2>
          {Array.isArray(slotData) && slotData.length > 0 ? (
            <div style={{ height: 'calc(100% - 60px)' }}>
              <Pie data={slotPieChartData} options={pieChartOptions} />
            </div>
          ) : (
            <div style={{
              height: 'calc(100% - 60px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              color: '#7f8c8d'
            }}>
              <p>No slot utilization data available</p>
            </div>
          )}
        </div>

        {/* Revenue Trends Line Chart */}
        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          height: '500px'
        }}>
          <h2 style={{ 
            color: '#2c3e50', 
            marginBottom: '20px',
            fontSize: '1.5rem'
          }}>Revenue Trends</h2>
          {revenueData.length > 0 ? (
            <div style={{ height: 'calc(100% - 60px)' }}>
              <Line data={revenueChartData} options={chartOptions} />
            </div>
          ) : (
            <div style={{
              height: 'calc(100% - 60px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              color: '#7f8c8d'
            }}>
              <p>No revenue data available for this period</p>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          padding: '15px',
          backgroundColor: '#fee',
          color: '#e74c3c',
          borderRadius: '8px',
          marginTop: '20px',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;