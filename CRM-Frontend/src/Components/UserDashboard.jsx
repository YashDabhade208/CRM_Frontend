import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useUser } from '../Contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    const [appointments, setAppointmnets] = useState([])
    const [id, setId] = useState(0)
    const { user, setUser } = useUser();
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(1)
    const steps = [
        { id: 1, title: "Step 1", description: "Appointment Scheduled" },
        { id: 2, title: "Step 2", description: "Appointment Confirmed" },
        { id: 3, title: "Step 3", description: "Appointment Completed" },
    ];


    if (user) {
        console.log(user.id);

        useEffect(() => { setId(user.id) }, [])
    }


    console.log(id, "i");

    const fetchAppointments = async () => {
        try {
            const response = await axios.post(`http://localhost:3000/api/upcomingappointments`, { id })
            if (response.status === 200) {
                const result = await response.json
                setAppointmnets(response.data.result)

            }
        }
        catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        fetchAppointments()
    }, [id])

    const handleLogout = () => {
        setUser(null); // Clear user context
        navigate('/')

    };



    return (<body className="relative bg-yellow-50 overflow-hidden max-h-screen">
        <header className="fixed right-0 top-0 left-60 bg-yellow-50 py-3 px-4 h-16">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <button type="button" className="flex items-center focus:outline-none rounded-lg text-gray-600 hover:text-yellow-600 focus:text-yellow-600 font-semibold p-2 border border-transparent hover:border-yellow-300 focus:border-yellow-300 transition">
                            <span className="inline-flex items-center justify-center w-6 h-6 text-gray-600 text-xs rounded bg-white transition mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                                </svg>
                            </span>
                            <span className="text-sm">Archive</span>
                        </button>
                    </div>
                    <div className="text-lg font-bold">Today's Plan</div>
                    <div>
                        <button type="button" className="flex items-center focus:outline-none rounded-lg text-gray-600 hover:text-yellow-600 focus:text-yellow-600 font-semibold p-2 border border-transparent hover:border-yellow-300 focus:border-yellow-300 transition">
                            <span className="text-sm">This week</span>
                            <span className="inline-flex items-center justify-center w-6 h-6 text-gray-600 text-xs rounded bg-white transition ml-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <aside className="fixed inset-y-0 left-0 bg-white shadow-md max-h-screen w-60">
            <div className="flex flex-col justify-between h-full">
                <div className="flex-grow">
                    <div className="px-4 py-6 text-center border-b">
                        <h1 className="text-xl font-bold leading-none"><span className="text-yellow-700">Task Manager</span> App</h1>
                    </div>
                    <div className="p-4">
                        <ul className="space-y-1">
                            <li>
                                <a href="javascript:void(0)" className="flex items-center bg-yellow-200 rounded-xl font-bold text-sm text-yellow-900 py-3 px-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" className="text-lg mr-4" viewBox="0 0 16 16">
                                        <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zm-3.5-7h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z" />
                                    </svg>Plan
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0)" className="flex bg-white hover:bg-yellow-50 rounded-xl font-bold text-sm text-gray-900 py-3 px-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" className="text-lg mr-4" viewBox="0 0 16 16">
                                        <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM5 4h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1zm-.5 2.5A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zM5 8h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1zm0 2h3a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1z" />
                                    </svg>Task list
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0)" className="flex bg-white hover:bg-yellow-50 rounded-xl font-bold text-sm text-gray-900 py-3 px-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" className="text-lg mr-4" viewBox="0 0 16 16">
                                        <path d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.825a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3zm-8.322.12C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139z" />
                                    </svg>Projects
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0)" className="flex bg-white hover:bg-yellow-50 rounded-xl font-bold text-sm text-gray-900 py-3 px-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-lg mr-4" viewBox="0 0 16 16">
                                        <path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1H2zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                    </svg>Tags
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="p-4">
                    <button onClick={handleLogout} type="button" className="inline-flex items-center justify-center h-9 px-4 rounded-xl bg-gray-900 text-gray-300 hover:text-white text-sm font-semibold transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" className="" viewBox="0 0 16 16">
                            <path d="M12 1a1 1 0 0 1 1 1v13h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V2a1 1 0 0 1 1-1h8zm-2 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                        </svg>
                    </button > <span className="font-bold text-sm ml-2">Logout</span>
                </div>
            </div>
        </aside>

        <main className="ml-60 pt-16 max-h-screen overflow-auto">
            <div className="px-6 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-3xl p-8 mb-5">
                        <h1 className="text-3xl font-bold mb-10">Messaging ID framework development for the marketing branch</h1>
                        <div className="flex items-center justify-between">
                            <div className="flex items-stretch">
                                <div className="text-gray-400 text-xs">Members<br />connected</div>
                                <div className="h-100 border-l mx-4"></div>
                                <div className="flex flex-nowrap -space-x-3">

                                </div>
                            </div>
                            <div className="flex items-center gap-x-2">
                                <button type="button" className="inline-flex items-center justify-center h-9 px-3 rounded-xl border hover:border-gray-400 text-gray-800 hover:text-gray-900 transition">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" className="bi bi-chat-fill" viewBox="0 0 16 16">
                                        <path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9.06 9.06 0 0 0 8 15z" />
                                    </svg>
                                </button>
                                <button type="button" className="inline-flex items-center justify-center h-9 px-5 rounded-xl bg-gray-900 text-gray-300 hover:text-white text-sm font-semibold transition">
                                    Open
                                </button>
                            </div>
                        </div>

                        <hr className="my-10" />

                        <div className="grid grid-cols-2 gap-x-20">
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Stats</h2>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <div className="p-4 bg-green-100 rounded-xl">
                                            <div className="font-bold text-xl text-gray-800 leading-none">Good day, <br />{user.name}</div>
                                            <div className="mt-5">
                                                <button type="button" className="inline-flex items-center justify-center py-2 px-3 rounded-xl bg-white text-gray-800 hover:text-green-500 text-sm font-semibold transition">
                                                    Start tracking
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-yellow-100 rounded-xl text-gray-800">
                                        <div className="font-bold text-2xl leading-none">20</div>
                                        <div className="mt-2">Tasks finished</div>
                                    </div>
                                    <div className="p-4 bg-yellow-100 rounded-xl text-gray-800">
                                        <div className="font-bold text-2xl leading-none">5,5</div>
                                        <div className="mt-2">Tracked hours</div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="p-4 bg-purple-100 rounded-xl text-gray-800">
                                            <div className="font-bold text-xl leading-none">Your daily plan</div>
                                            <div className="mt-2">5 of 8 completed</div>
                                        </div>
                                    </div>

                                    {appointments.map((apoint, index) => (<div key={index}><ol className="overflow-hidden space-y-8">
                                        {steps.map((step, index) => (
                                            <li
                                                key={step.id}
                                                className={`relative flex-1 ${index < currentStep - 1
                                                        ? "after:bg-indigo-600"
                                                        : "after:bg-gray-200"
                                                    } after:content-[''] after:w-0.5 after:h-full after:inline-block after:absolute after:-bottom-11 after:left-4 lg:after:left-5`}
                                            >
                                                <a
                                                    className="flex items-center font-medium w-full"
                                                    href="#"
                                                >
                                                    <span
                                                        className={`w-8 h-8 ${index < currentStep
                                                                ? "bg-indigo-600 text-white border-transparent"
                                                                : index === currentStep
                                                                    ? "bg-indigo-50 text-indigo-600 border-indigo-600"
                                                                    : "bg-gray-50 text-gray-600 border-gray-200"
                                                            } border-2 rounded-full flex justify-center items-center mr-3 text-sm lg:w-10 lg:h-10`}
                                                    >
                                                        {index < currentStep ? (
                                                            <svg
                                                                className="w-5 h-5 stroke-white"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    d="M5 12L9.28722 16.2923C9.62045 16.6259 9.78706 16.7927 9.99421 16.7928C10.2014 16.7929 10.3681 16.6262 10.7016 16.2929L20 7"
                                                                    strokeWidth="1.6"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                        ) : (
                                                            index + 1
                                                        )}
                                                    </span>
                                                    <div className="block">
                                                        <h4
                                                            className={`text-lg ${index < currentStep
                                                                    ? "text-indigo-600"
                                                                    : index === currentStep
                                                                        ? "text-indigo-600"
                                                                        : "text-gray-900"
                                                                }`}
                                                        >
                                                            {step.title}
                                                        </h4>
                                                        <span className="text-sm">{step.description}</span>
                                                    </div>
                                                </a>
                                            </li>
                                        ))}
                                    </ol></div>))}


                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Your Upcoming Appointmnets</h2>

                                <div className="space-y-4">
                                    {appointments.map((appoint, index) => (<div className="p-4 bg-white border rounded-xl text-gray-800 space-y-2">
                                        <div className="flex justify-between">
                                            <div className="text-gray-400 text-xs">Patient Id:{appoint.patient_id}</div>
                                            <div className="text-gray-400 text-xs">Appointment Time:{appoint.appointment_time}</div>
                                        </div>
                                        { }
                                        <div className="text-sm text-gray-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" className="text-gray-800 inline align-middle mr-1" viewBox="0 0 16 16">
                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                                            </svg>{appoint.status}
                                        </div>
                                    </div>))}


                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </body>


    )
}

export default UserDashboard