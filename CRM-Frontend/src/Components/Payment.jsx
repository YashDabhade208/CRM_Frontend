import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../Config/apiConfig";
const Payment = () => {
  const [prices, setPrices] = useState([]);
  const [message, SetMessage] = useState("");
  const [error, SetError] = useState("");
  const [orderAmount, setOrrderAmount] = useState(400);
  const orderId = `order_${Date.now()}`; // Unique order ID

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
    const paymentObj = {
      orderId,
      orderAmount,
      ...customerDetails,
    };

    try {
      // Step 1: Generate Order Token
      const response = await axios.post(
        `${BASE_URL}/processpayment`,
        paymentObj,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("base url is form payment.jsx: " ,BASE_URL);
      
      console.log(paymentObj, "payment pbject from payment.jsx");

      const paymentSessionId = response.data.response.payment_session_id; // Extract the session ID
      console.log("Payment Session ID:", paymentSessionId);
      const result = await response.data;
      console.log(result);

      // Step 2: Initialize Cashfree Checkout
      let checkoutOptions = {
        paymentSessionId: paymentSessionId, // Use the session ID from the API response
        redirectTarget: "_modal",
      };

      const nigga = await cashfree.checkout(checkoutOptions).then((result) => {
        if (result.error) {
          console.error(
            "User closed the popup or an error occurred during the payment:",
            result.error
          );
        }
        if (result.redirect) {
          console.log("Payment will be redirected.");
        }
        if (result.paymentDetails) {
          console.log("Payment completed:", result.paymentDetails);
          console.log(nigga);
        }
      });
    } catch (error) {
      console.error("Payment initiation failed", error);
    }
  };
  const handlePriceChange = (e) => {
    e.prevent.default;
    setOrrderAmount(e);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Cashfree Payment Integration
      </h1>
      <select
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
      </select>

      <button
        onClick={handlePayment}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      >
        Pay Now ₹{orderAmount}
      </button>
    </div>
  );
};

export default Payment;
