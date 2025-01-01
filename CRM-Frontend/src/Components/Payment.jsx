import React from "react";
import axios from "axios";
const cashfree = new window.Cashfree();
const Payment = () => {


    const token = sessionStorage.getItem('jwtToken')
    if (cashfree && typeof cashfree.redirect === "function") {
      cashfree.redirect({
        order_token,
        order_id: orderId,
        order_currency: "INR",
        order_amount: orderAmount,
        notify_url: "https://yourdomain.com/notify",
      });
    } else {
      console.error("Cashfree SDK is not properly loaded or redirect function is unavailable.");
    }
    
  const handlePayment = async () => {
    const orderId = `order_${Date.now()}`; // Unique order ID
    const orderAmount = 500; // Example amount
    const customerDetails = {
      customerName: "John Doe",
      customerEmail: "john.doe@example.com",
      customerPhone: "9999999999",
    };
    const paymentObj = {
        orderId,orderAmount,...customerDetails
    }

    try {
      // Step 1: Generate Order Token
      const response = await axios.post("http://localhost:3000/api/processpayment",
        paymentObj
      ,{
        headers:{"Authorization":`Bearer ${token}`
      }});

      const { order_token } = response.data;

      // Step 2: Initialize Cashfree Payment
      // const cashfree = new window.Cashfree();
      // cashfree.redirect({
      //   order_token,
      //   order_id: orderId,
      //   order_currency: "INR",
      //   order_amount: orderAmount,
      //  // notify_url: "https://yourdomain.com/notify", // Optional webhook
      // });
    } catch (error) {
      console.error("Payment initiation failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Cashfree Payment Integration
      </h1>
      <button
        onClick={handlePayment}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      >
        Pay Now
      </button>
    </div>
  );
};

export default Payment;
