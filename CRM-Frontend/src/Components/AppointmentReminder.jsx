import React, { useEffect, useState } from 'react';

const AppointmentReminder = (props) => {

    const [userId, setuserId] = useState();

  useEffect(() => {
    const setupNotifications = async () => {
      await requestNotificationPermission();
      await scheduleAppointmentNotifications(userId);
    };

    setupNotifications();
  }, [userId]);

  useEffect(() => {
    setuserId(props.id)
    console.log(userId);
  },[props])

 
  

  //Check for Appointments: Fetch the appointments and check if any appointment is within the next 3 hours.
  const scheduleAppointmentNotifications = async (userId) => {
    // Fetch appointments
    const response = await fetch(`http://localhost:3000/api/appointmentreminder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: userId }),
    });
    
    const data = await response.json();
    console.log(data);
    
  
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
      const timeUntilNotification = timeUntilAppointment - (12* 60 * 1000); // 3 hours before
      console.log(timeUntilNotification/60000,"hh");
      
  
      if (timeUntilNotification > 0) {
        setTimeout(() => {
          alert("get yo ass to hospital")
          new Notification('Appointment Reminder', {
            body: `You have an appointment scheduled at ${appointment.appointment_time}.`,
          });
        }, timeUntilNotification);
      }
    });
  };

  
  //Request Notification Permission: First, request permission from the user to show notifications.
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
  
  return (
    <div>
      {/* Your component code */}
    </div>
  );
};

export default AppointmentReminder;
