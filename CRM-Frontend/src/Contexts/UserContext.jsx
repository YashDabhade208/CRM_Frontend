import React, { createContext, useState, useContext,useEffect } from 'react';

// Create a context for the user
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(()=>{
    const savedUser = sessionStorage.getItem('user');
  return savedUser ? JSON.parse(savedUser) : null
  }); 

  const [doctor,setDoctor] =useState()
  const [loggedin,setloggedIn] = useState(false)
  


  useEffect(() => {
    
    if (user) {
      const { id, name, email } = user;
      sessionStorage.setItem('user', JSON.stringify({id, name}));
      sessionStorage.setItem('loginState', JSON.stringify(loggedin))
    } else {
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('loginState');

    }
  }, [user]);
  




  return (
    <UserContext.Provider value={{ user, setUser ,loggedin,setloggedIn}}>
      {children}
    </UserContext.Provider>
  );
};


export const useUser = () => useContext(UserContext);
