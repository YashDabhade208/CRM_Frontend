import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../Contexts/UserContext';

const PatientRegistration = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userName ,setuserName] = useState("")
    const {user} = useUser()
    //console.log(user.name);

   


    
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        phone: "",
        dob: "",
        gender: "Male",
        address: "",
        user_id: user.id, 
        age :1// Assuming this is a fixed value for now
    });

    useEffect(() => {
        if (user?.name) {
            setuserName(user.name);
        }
    }, [user]);

    // Fetch user ID
    const fetchUserID = async () => {
     
        try {
            setIsLoading(true);
          
            
            const response = await axios.post("http://localhost:3000/api/getuserid", { userName });
            if (response.status === 200) {
                const  {result}  = response.data;
                // console.log(result.id);

                // Update formData with user_id
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    user_id: result.id, // Correctly setting user_id
                }));
            } else {
                throw new Error("Error fetching user ID");
            }
        } catch (error) {
            console.error(error);
            setError("Failed to fetch user ID");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (userName) {
            fetchUserID();
        }
    }, [userName]);
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:3000/api/profile', formData);
            if (response.status === 200) {
                alert('Patient registered successfully!');
                setFormData({
                    first_name: "",
                    last_name: "",
                    phone: "",
                    dob: "",
                    gender: "Male",
                    address: "",
                    user_id: 0,
                });
            } else {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Patient Registration</h1>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="first_name" className="block font-medium">First Name</label>
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="last_name" className="block font-medium">Last Name</label>
                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="phone" className="block font-medium">Phone</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="dob" className="block font-medium">Date of Birth</label>
                    <input
                        type="date"
                        id="dob"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="gender" className="block font-medium">Gender</label>
                    <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        required
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="address" className="block font-medium">Address</label>
                    <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        required
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="age" className="block font-medium">Age</label>
                    <input
                        type="age"
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    disabled={isLoading}
                >
                    {isLoading ? 'Submitting...' : 'Register Patient'}
                </button>
            </form>
        </div>
    );
};

export default PatientRegistration;
