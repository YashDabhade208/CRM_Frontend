import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../Config/apiConfig";

import Confetti from "react-confetti";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from '../Contexts/UserContext';
import { CheckCircle, CreditCard, AlertCircle } from "lucide-react";

const Payment = () => {
  const navigate = useNavigate();
  const [prices, setPrices] = useState([]);
  const [orderAmount, setOrderAmount] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState(null);
  const [newOrderId, setNewOrderId] = useState();
  const [email, setEmail] = useState('');
  const [appointmentIds, setAppointmentIds] = useState([]);
  const [message,setMessage]=useState()
  const [error, setError] = useState(null); // Error state
  const { user, setUser } = useUser();
  const [id, setId] = useState();
  const { appointmentId } =useParams();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);


  
  // Rest of the function
  // Reset after process completion


  console.log(appointmentId);
  
 
  
  const token = sessionStorage.getItem("jwtToken");
   useEffect(() => {
      if (user) {
        setEmail(user.email);        
      }
    }, [user]);
    console.log("email",email);

    const fetchUserID = React.useCallback(async () => {
      try {
        setIsLoading(true);
        const response = await axios.post(`${BASE_URL}/getuserid`, { email }, {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        console.log("API Response:", response.data);
    
        if (response.status === 200 && response.data && response.data.result) {
          const { id } = response.data.result; // Destructure `id` from `result`
          setId(id); // Set the ID in state
          console.log("User ID from payment.jsx:", id); // Log the extracted `id`
        } else {
          console.error("Unexpected API response:", response);
          setError("Error: Unexpected response structure");
        }
      } catch (error) {
        console.error("Error in fetchUserID:", error);
        setError("Failed to fetch user ID");
      } finally {
        setIsLoading(false);
      }
    }, [email, token]);
    
    
    
  
    useEffect(() => {
      if (email) {
        fetchUserID();
      } else {
        console.warn("Email is empty, skipping fetchUserID call");
      }
    }, [email, fetchUserID]);
    

    const customerDetails = {
      customerName: user.name,
      customerEmail: email,
      customerPhone: "9999999999",
    };
  

  
  const cashfree = Cashfree({
    mode: "sandbox", // or production
  });
  
  const fetchAppointments = React.useCallback(async () => {
    console.log("Attempting to fetch appointments for user ID:", id);
    console.log("Using token:", token); // Remove in production
  
    try {
      // Log the request details
      console.log("Making request with:", {
        url: `${BASE_URL}/getappointmentsbyuserid`,
        body: { id },
        headers: { Authorization: `Bearer ${token}` }
      });
  
      const response = await axios.post(
        `${BASE_URL}/getappointmentsbyuserid`,
        { id },
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      console.log("Full API Response:", response);
  
      // Handle the nested response structure
      const appointments = response.data.data;
      
      if (Array.isArray(appointments)) {
        if (appointments.length > 0) {
          const ids = appointments.map((appointment) => appointment.appointment_id);
          setAppointmentIds(ids);
          console.log("Processed appointment IDs:", ids);
        } else {
          setMessage("No appointments found.");
          setAppointmentIds([]);
        }
      } else if (appointments && appointments.data) {
        // Handle the nested data structure if present
        const nestedAppointments = appointments.data;
        if (Array.isArray(nestedAppointments) && nestedAppointments.length > 0) {
          const ids = nestedAppointments.map((appointment) => appointment.appointment_id);
          setAppointmentIds(ids);
          console.log("Processed nested appointment IDs:", ids);
        } else {
          setMessage(appointments.message || "No appointments found.");
          setAppointmentIds([]);
        }
      } else {
        setMessage("Invalid response format");
        setAppointmentIds([]);
      }
    } catch (error) {
      console.error("Full error object:", error);
      setMessage(error.response?.data?.message || "Failed to fetch appointments.");
      setAppointmentIds([]);
    }
  }, [id, token]);
  

  useEffect(() => {
    if (!token) {
      console.error("No token available");
      setMessage("Authentication required");
      return;
    }
    
    if (!id) {
      console.error("No user ID available");
      setMessage("User ID required");
      return;
    }
    
    fetchAppointments();
  }, [id, token, fetchAppointments]);

  const handleConfirmAppointment = async (appointmentId) => {
    console.log("calling handleConfirmAppointment");
    
    try {
      const response = await fetch(`${BASE_URL}/confirmappointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ appointment_id: appointmentId })
      });
  
      const data = await response.json();
      console.log('Appointment confirmation response:', data);
      
      // You might want to add success handling here
      if (response.ok) {
        // For example, show a success message or update UI
        console.log('Appointment confirmed successfully');
        return data;
      } else {
        throw new Error(data.message || 'Failed to confirm appointment');
      }
  
    } catch (error) {
      console.error('Error confirming appointment:', error);
      // You might want to add error handling here
      throw error;
    }
  };

  


  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get(`https://crm-backend-yash208.vercel.app/getprices`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          setPrices(response.data.result);
          console.log(response.data.result);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchPrices();
  }, []);

  const handlePayment = async () => {
    if (isProcessingPayment) return;
    setIsProcessingPayment(true);
  
    const orderId = `${Date.now()}`;
    const paymentObj = {
      orderId,
      orderAmount,
      ...customerDetails,
    };
  
    try {
      const response = await axios.post(
        `https://crm-backend-yash208.vercel.app/processpayment`,
        paymentObj,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const paymentSessionId = response.data.response.payment_session_id;
      const generatedOrderId = response.data.response.order_id;
      setNewOrderId(generatedOrderId);
  
      let checkoutOptions = {
        paymentSessionId: paymentSessionId,
        redirectTarget: "_modal",
      };
  
      const result = await cashfree.checkout(checkoutOptions);
  
      if (result.error) {
        console.log("Payment error:", result.error);
      } else if (result.paymentDetails) {
        console.log("Payment completed:", result.paymentDetails.paymentMessage);
        //setOrderStatus("PAID");
  
        const statusResponse = await axios.post(
          `http://localhost:3000/getorderstatus`,
          {
            orderId: generatedOrderId,
            appointmentId: appointmentId,
            userId: id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
   
        setOrderStatus(statusResponse.data.orderStatus);
        console.log("orderStatus:", statusResponse.data.orderStatus);
      }
    } catch (error) {
      console.error("Payment initiation failed", error);
    } finally {
      console.log("in finally block");
      
      if (orderStatus === "Success") {
        console.log("orderStatus is PAID and calling handleConfirmAppointment");
        try {
          await handleConfirmAppointment(appointmentId);
        } catch (error) {
          console.log("error in handleConfirmAppointment", error);
        }
      }
      setIsProcessingPayment(false);
    }
  };
  
  
  const handleOrderAmount = (e)=>{
      
      setOrderAmount(e.target.value)
    }

   

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Complete Your Payment</h1>
            <p className="text-gray-600">Select your appointment type and proceed with the payment</p>
          </div>
  
          {orderStatus === "Success" ? (
            <div className="bg-white rounded-lg shadow-xl p-6">
              <div className="text-center">
                <Confetti className="fixed inset-0" />
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Payment Successful!
                </h2>
                <p className="text-gray-600 mb-6">
                  Your payment of ₹{orderAmount} has been processed successfully.
                </p>
                <button
                  onClick={() => navigate("/userdashboard")}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  View Dashboard
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-xl">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                  <CreditCard className="w-5 h-5 text-blue-500" />
                  Payment Details
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {/* Price Selection */}
                  <div className="space-y-2">
                    <label htmlFor="prices" className="block text-sm font-medium text-gray-700">
                      Select Appointment Type
                    </label>
                    <select
                      id="prices"
                      name="prices"
                      onChange={handleOrderAmount}
                      className="mt-1 block w-full pl-3 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md transition-colors duration-200"
                    >
                      <option value="">Choose your appointment type</option>
                      {prices.map((priceObj, index) => (
                        <option key={index} value={priceObj.price}>
                          {priceObj.appointment_type} - {priceObj.price} {priceObj.currency}
                        </option>
                      ))}
                    </select>
                  </div>
  
                  {/* Amount Display */}
                  {orderAmount && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-600">Total Amount:</span>
                        <span className="text-lg font-semibold text-gray-900">₹{orderAmount}</span>
                      </div>
                    </div>
                  )}
  
                  {/* Pay Button */}
                  <button
                    onClick={handlePayment}
                    disabled={!orderAmount}
                    className={`w-full flex items-center justify-center px-6 py-3 rounded-md text-white font-medium transition-all duration-200 ${
                      orderAmount
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-blue-400 cursor-not-allowed"
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    {orderAmount ? `Pay ₹${orderAmount}` : "Select an amount"}
                  </button>
  
                  {/* Security Notice */}
                  <div className="flex items-center justify-center text-sm text-gray-500 mt-4">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    <span>Your payment is secured with end-to-end encryption</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default Payment;