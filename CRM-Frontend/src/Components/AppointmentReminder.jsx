import React, { useEffect, useState } from 'react';
import BASE_URL from '../../Config/apiConfig';

const AppointmentReminder = (props) => {
  const [userId, setUserId] = useState(null);
  const [intervalId, setIntervalId] = useState(null);

  const token = sessionStorage.getItem('jwtToken');

  // Update userId when props.id changes
  useEffect(() => {
    if (props.id) {
      setUserId(props.id);
    }
  }, [props.id]);

  // Setup notifications when userId is ready
  useEffect(() => {
    if (userId) {
      const initialize = async () => {
        await requestNotificationPermission();
        startAppointmentChecking(userId);
      };
      initialize();
    }

    // Cleanup on unmount
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [userId]);

  // Request browser notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted.');
      } else {
        console.log('Notification permission denied.');
      }
    } else {
      console.log('This browser does not support notifications.');
    }
  };

  // Start checking appointments every 1 minute
  const startAppointmentChecking = (userId) => {
    const id = setInterval(() => {
      checkAppointments(userId);
    }, 60000); // Every 60 seconds
    setIntervalId(id);
  };

  // Fetch appointments and notify if needed
  const checkAppointments = async (userId) => {
    try {
      const response = await fetch(`${BASE_URL}/appointmentreminder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: userId }),
      });

      if (!response.ok) {
        console.error("Failed to fetch appointments");
        return;
      }

      const data = await response.json();
      console.log("Fetched appointments:", data);

      const now = new Date();

      data.result.forEach(appointment => {
        const appointmentDate = new Date(appointment.appointment_date);
        const appointmentTime = new Date(`1970-01-01T${appointment.appointment_time}Z`);

        const appointmentDateTime = new Date(
          appointmentDate.getFullYear(),
          appointmentDate.getMonth(),
          appointmentDate.getDate(),
          appointmentTime.getUTCHours(),
          appointmentTime.getUTCMinutes(),
          appointmentTime.getUTCSeconds()
        );

        const timeUntilAppointment = appointmentDateTime - now;
        const timeBeforeNotification = 3 * 60 * 60 * 1000; // 3 hours in ms

        // Check if appointment is within next 3 hours
        if (timeUntilAppointment > 0 && timeUntilAppointment <= timeBeforeNotification) {
          sendNotification(appointment);
        }
      });

    } catch (error) {
      console.error("Error checking appointments:", error);
    }
  };

  // Send notification
  const sendNotification = (appointment) => {
    if (Notification.permission === "granted") {
      try {
        const notification = new Notification("Appointment Reminder", {
          body: `You have an appointment today at ${appointment.appointment_time}!`,
        });
        console.log("Notification sent!");
      } catch (error) {
        console.error("Failed to create notification:", error);
      }
    } else {
      console.log("Notifications not allowed.");
    }

    alert("Reminder: Go to the hospital!");
  };

  return (
    <div>
      {/* This component works silently */}
    </div>
  );
};

export default AppointmentReminder;
