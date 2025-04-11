import React from 'react'
import Sidebar from './Sidebar'

const AdminDashboard = () => {
  return (
    <>
    <div className='flex h-screen'>
    <Sidebar />
    <main class="flex-1 p-6 bg-gray-100">
            <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <div class="mt-4 p-6 bg-white rounded-lg shadow-md">
                <p class="text-gray-600">Welcome to your dashboard. This is a basic sidebar menu example.</p>
            </div>
        </main>
    </div>
    
    </>
    
  )
}

export default AdminDashboard