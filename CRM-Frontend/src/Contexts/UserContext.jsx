import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a context for the user
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Initialize state with sessionStorage data if available
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loggedin, setloggedIn] = useState(() => {
    const loginState = sessionStorage.getItem('loginState');
    return loginState ? JSON.parse(loginState) : false;
  });

  const [doctor, setDoctor] = useState(() => {
    const storedDoctor = sessionStorage.getItem('doctor');
    return storedDoctor ? JSON.parse(storedDoctor) : null;
  });

  useEffect(() => {
    // Sync user and login state with sessionStorage
    if (user) {
      const { id, name,email} = user; // Limit stored data to essentials
      sessionStorage.setItem('user', JSON.stringify({ id, name,email}));
    } else {
      sessionStorage.removeItem('user');
    }

    sessionStorage.setItem('loginState', JSON.stringify(loggedin));
  }, [user, loggedin]);

  useEffect(() => {
    // Sync doctor data with sessionStorage
    if (doctor) {
      sessionStorage.setItem('doctor', JSON.stringify(doctor));
    } else {
      sessionStorage.removeItem('doctor');
    }
  }, [doctor]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loggedin,
        setloggedIn,
        doctor,
        setDoctor,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
