import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../Config/apiConfig";
const Payment = () => {
  const [prices, setPrices] = useState([]);
  const [message, SetMessage] = useState("");
  const [error, SetError] = useState("");
  const [orderAmount, setOrrderAmount] = useState(100);
  const [orderId,setOrderId] = useState();
  //const orderId = `${Date.now()}`; // Unique order ID
  const [date, setDate] = useState('');
  const [orderStatus, setOrderStatus] = useState(null);
  const [neworderId,setNewOrderId] = useState()

  const customerDetails = {
    customerName: "Carl Johnson",
    customerEmail: "cj.doe@example.com",
    customerPhone: "9999999999",
  };
  const token = sessionStorage.getItem("jwtToken");
  const cashfree = Cashfree({
    mode: "sandbox", // or production
  });

  useEffect(() => {
    const Fetchprices = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/getprices`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          setPrices(response.data.result);
          console.log(response.data.result);
        }
      } catch (error) {
        console.log(error);
        SetError(error);
      }
    };
    Fetchprices();
  }, []);





  const handlePayment = async () => {
    const orderid = `${Date.now()}`;
    setOrderId(orderid);
    const paymentObj = {
      orderId: orderid,
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
      const newOrderId = response.data.response.order_id;
      setNewOrderId(newOrderId);
  
      let checkoutOptions = {
        paymentSessionId: paymentSessionId,
        redirectTarget: "_modal",
      };
  
      const result = await cashfree.checkout(checkoutOptions);
  
      if (result.error) {
        console.log("Payment error:", result.error);
      } else if (result.redirect) {
        console.log("Payment will be redirected");
      } else if (result.paymentDetails) {
        console.log("Payment completed:", result.paymentDetails.paymentMessage);
      }
  
      // Getting order status
      console.log("orderId while getting order status", newOrderId);
      const statusResponse = await axios.post('https://crm-backend-yash208.vercel.app/getorderstatus', {
        orderId: newOrderId,
      });
      setOrderStatus(statusResponse.data.orderStatus);
      console.log("orderStatus:", statusResponse.data.orderStatus);
  
    } catch (error) {
      console.error("Payment initiation failed", error);
    }
  };
  



  const handlePriceChange = (e) => {
    e.prevent.default;
    setOrrderAmount(e);
  };
  
   
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      SetError(null);
      setOrderStatus(null);

    }


    

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Cashfree Payment Integration
      </h1>
      {/* <select
        name="price"
        id="price"
        value={orderAmount}
        onChange={(e) => setOrrderAmount(e.target.value)}
        className="mb-4 px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      >
        <option value="">Select Price</option>
        {prices.map((price, index) => (
          <option key={index} value={price.price}>
            {price.appointment_type} ₹{price.price}
          </option>
        ))}
      </select> */}

      <button
        onClick={handlePayment}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      >
        Pay Now ₹{orderAmount}
        
      </button>
      <div>{orderStatus}</div>
    </div>
  );
};

export default Payment;
