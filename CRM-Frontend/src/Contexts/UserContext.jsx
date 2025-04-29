import { createContext, useState, useContext, useEffect } from 'react';

// Create a context for the user
const UserContext = createContext({
  user: null,
  setUser: () => {},
  loggedin: false,
  setloggedIn: () => {},
  doctor: null,
  setDoctor: () => {},
  isDoctorLoggedin: false,
  setIsDoctorLoggedin: () => {},
});

const saveToSessionStorage = (key, value) => {
  if (value !== null) {
    sessionStorage.setItem(key, JSON.stringify(value));
  } else {
    sessionStorage.removeItem(key);
  }
};

const parseSessionStorage = (key) => {
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error parsing sessionStorage key "${key}":`, error);
    return null;
  }
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => parseSessionStorage('user'));
  const [loggedin, setloggedIn] = useState(() => parseSessionStorage('loginState'));
  const [doctor, setDoctor] = useState(() => parseSessionStorage('doctor'));
  const [isDoctorLoggedIn, setIsDoctorLoggedIn] = useState(() => parseSessionStorage('doctorLoginState') || false);

  useEffect(() => {
    saveToSessionStorage('user', user ? { id: user.id, name: user.name, email: user.email } : null);
    saveToSessionStorage('loginState', loggedin);
  }, [user, loggedin]);

  useEffect(() => {
    // saveToSessionStorage('doctor', doctor);
    // saveToSessionStorage('doctorLoginState', isDoctorLoggedIn);
  }, [doctor, isDoctorLoggedIn]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loggedin,
        setloggedIn,
        doctor,
        setDoctor,
        isDoctorLoggedIn,
        setIsDoctorLoggedIn,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
