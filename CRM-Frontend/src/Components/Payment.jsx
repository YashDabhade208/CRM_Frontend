import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../Config/apiConfig";
import { CheckCircle } from "lucide-react";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";
import { useUser } from '../Contexts/UserContext';

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
 const [id, setId] = useState(9);
  

   useEffect(() => {
      if (user) {
        setEmail(user.email);
       
        
      }
    }, [user]);
    console.log("email",email);



    const fetchUserID = async () => {
      try {
        setIsLoading(true);
        const response = await axios.post(`${BASE_URL}/getuserid`, { email:email},{headers: {
          "Authorization": `Bearer ${token}`,
      }});
  
        if (response.status === 200) {
          const { result } = await response.data;
          setId(result.id);
          setIsLoading(false);
          console.log("user id from paymet.jsx",result);
          
        } else {
          throw new Error('Error fetching user ID');
        }
      } catch (error) {
        console.error(error);
        setError('Failed to fetch user ID');
      } finally {
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
     
        fetchUserID();
      
    }, [email]);

  const customerDetails = {
    customerName: "Carl Johnson",
    customerEmail: "cj.doe@example.com",
    customerPhone: "9999999999",
  };

  const token = sessionStorage.getItem("jwtToken");
  const cashfree = Cashfree({
    mode: "sandbox", // or production
  });
  const fetchAppointments = async () => {
    console.log(id,"user id in fetchuserid");
    
    try {
      const response = await axios.post(
        `${BASE_URL}/getappointmentsbyuserid`,
        {id}, {headers: {
          "Authorization": `Bearer ${token}`,
      }}
      );     
      const result = response.data.data

      console.log(response.data.data);
      if (result) {
        const ids = result.map(appointment => appointment.appointment_id);
        setAppointmentIds(ids);
        console.log("appointmentids",appointmentIds);
       
        
       // setPatientData(patients);
        setMessage("");
      } else {
        
        setMessage("No appointments found.");
      }
    } catch (error) {
      setAppointments([]);
      setMessage(
        error.response?.data?.message || "Failed to fetch appointments."
      );
    }
    
  };

  useEffect(() => {
    fetchAppointments();
  }, [id]);

  


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
      const generatedOrderId = response.data.response.order_id; // Use generatedOrderId here
      setNewOrderId(generatedOrderId); // Set the orderId to state
  
      let checkoutOptions = {
        paymentSessionId: paymentSessionId,
        redirectTarget: "_modal",
      };
  
      const result = await cashfree.checkout(checkoutOptions);
  
      if (result.error) {
        console.log("Payment error:", result.error);
      } else if (result.paymentDetails) {
        console.log("Payment completed:", result.paymentDetails.paymentMessage);
        // Update order status to success
        setOrderStatus("PAID");
  
        // Now use the newOrderId after it has been set
        console.log("newOrderId while getting order status", generatedOrderId);
        const statusResponse = await axios.post(
          'https://crm-backend-yash208.vercel.app/getorderstatus',
          {
            orderId: generatedOrderId,
          }
        );
        setOrderStatus(statusResponse.data.orderStatus);
        console.log("orderStatus:", statusResponse.data.orderStatus);
      }
    } catch (error) {
      console.error("Payment initiation failed", error);
    }
  };
  
  const handleOrderAmount = (e)=>{
      
      setOrderAmount(e.target.value)
    }



return (
  <>
  <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
    <h1 className="text-3xl font-bold mb-6 text-gray-800">
      Cashfree Payment Integration
    </h1>
    
    <div className="py-3 my-12 bg-gray-100 flex flex-col items-center justify-center">
      <select name="prices" id="prices" onChange={handleOrderAmount}>
        <option value="">Select Appointment Type</option>
        {prices.map((priceObj, index) => (
          <option  key={index} value={priceObj.price}>
            {priceObj.appointment_type} - {priceObj.price} {priceObj.currency}
          </option>
        ))}
      </select>
    </div>

      
    

    {orderStatus === "PAID" ? (
      <div className="text-center">
        <Confetti className="absolute inset-0" />
        <div className="flex flex-col items-center bg-white rounded-lg p-6 shadow-lg">
          <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for your payment of ₹{orderAmount}.
          </p>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            onClick={() => navigate("/userdashboard")}
          >
            Go to Dashboard
          </button>
          <p className="mt-4 text-gray-500">
            Click on the dashboard for more details about your transaction.
          </p>
        </div>
      </div>
    ) : (
      <div className="flex flex-col items-center">
        <button
          onClick={handlePayment}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          Pay Now ₹{orderAmount}
        </button>
      </div>
    )}
  </div>
  </>
);
};

export default Payment;
