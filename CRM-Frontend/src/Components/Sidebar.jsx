import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  // Navigation items data
  const navItems = [
    {
      name: 'Dashboard',
      path: '/admindashboard',
      icon: (
        <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      name: 'Patients',
      path: '/patientdata',
      icon: (
        <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      name: 'Projects',
      path: '/projects',
      icon: (
        <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      )
    },
    {
      name: 'Appointment',
      path: '/bookappointment',
      icon: (
        <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      name: 'Prescriptions',
      path: '/prescriptions',
      icon: (
        <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      )
    },
    {
      name: 'Reports',
      path: '/reports',
      icon: (
        <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ];

  return (
    <aside className="w-64 bg-white shadow-md flex flex-col h-screen">
      {/* Logo and Dashboard Title */}
      <div className="p-4 border-b">
        <div className="flex items-center">
          <img src="https://tailwindflex.com/images/logo.svg" alt="Logo" className="h-8 w-auto" />
          <span className="ml-2 text-xl font-semibold text-gray-800">Dashboard</span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="mt-5 px-2 flex-1">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => 
              `group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
            }
          >
            {React.cloneElement(item.icon, {
              className: `mr-3 h-6 w-6 ${window.location.pathname === item.path ? 'text-indigo-700' : 'text-gray-400 group-hover:text-gray-500'}`
            })}
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="mt-auto p-4 border-t">
        <div className="flex items-center">
          <img 
            className="h-8 w-8 rounded-full" 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
            alt="User" 
          />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">Rajesh Maheshwari</p>
            <NavLink to="/profile" className="text-xs font-medium text-gray-500 hover:text-gray-700">
              View Profile
            </NavLink>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;