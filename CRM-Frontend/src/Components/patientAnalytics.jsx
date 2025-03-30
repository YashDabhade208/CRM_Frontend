import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const styles = {
  container: {
    padding: '30px',
    backgroundColor: '#f5f7fb',
    minHeight: '100vh',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    fontSize: '2.5rem',
    color: '#2c3e50',
    marginBottom: '30px',
    textAlign: 'center',
    fontWeight: '700',
    background: 'linear-gradient(45deg, #2c3e50, #3498db)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '25px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
    }
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '25px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    marginBottom: '30px',
  },
  patientList: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '25px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  },
  patientCard: {
    padding: '15px',
    borderBottom: '1px solid #eef2f6',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    alignItems: 'center',
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: '#f8fafc',
    }
  },
  badge: (type) => ({
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '500',
    backgroundColor: type === 'Returning Patient' ? '#e1f7e1' : '#fff3e0',
    color: type === 'Returning Patient' ? '#2e7d32' : '#ef6c00',
    display: 'inline-block',
  }),
};

export const PatientAnalytics = () => {
  const [patientData, setPatientData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/getpatienttype', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setPatientData(response.data.result);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch patient data');
        setLoading(false);
      }
    };
    fetchPatientData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Loading patient analytics...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '50px', 
        color: '#e74c3c' 
      }}>
        <h2>{error}</h2>
      </div>
    );
  }

  // Calculate statistics
  const totalPatients = patientData.length;
  const returningPatients = patientData.filter(p => p.patient_type === 'Returning Patient').length;
  const newPatients = totalPatients - returningPatients;

  // Prepare chart data
  const chartData = {
    labels: ['Returning Patients', 'New Patients'],
    datasets: [{
      data: [returningPatients, newPatients],
      backgroundColor: [
        'rgba(46, 204, 113, 0.8)',
        'rgba(231, 76, 60, 0.8)',
      ],
      borderColor: [
        'rgba(46, 204, 113, 1)',
        'rgba(231, 76, 60, 1)',
      ],
      borderWidth: 1,
    }],
  };

  const chartOptions = {
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
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Patient Analytics Overview</h1>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <h3 style={{ color: '#7f8c8d', marginBottom: '10px' }}>Total Patients</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50' }}>{totalPatients}</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={{ color: '#7f8c8d', marginBottom: '10px' }}>Returning Patients</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2ecc71' }}>{returningPatients}</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={{ color: '#7f8c8d', marginBottom: '10px' }}>New Patients</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e74c3c' }}>{newPatients}</p>
        </div>
      </div>

      <div style={styles.chartContainer}>
        <Pie data={chartData} options={chartOptions} />
      </div>

      <div style={styles.patientList}>
        <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>Patient Details</h2>
        {patientData.map((patient) => (
          <div key={patient.patient_id} style={styles.patientCard}>
            <div>
              <strong>{patient.first_name} {patient.last_name}</strong>
            </div>
            <div>{patient.email}</div>
            <div>{patient.phone || 'No phone'}</div>
            <div>
              <span style={styles.badge(patient.patient_type)}>
                {patient.patient_type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientAnalytics;
