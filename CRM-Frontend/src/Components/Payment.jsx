import React, { useState } from "react";
import axios from "axios";

const Payment = () => {
  const token = sessionStorage.getItem("jwtToken");
  const cashfree = Cashfree({
    mode: "sandbox", // or production
  });

  const handlePayment = async () => {
    const orderId = `order_${Date.now()}`; // Unique order ID
    const orderAmount = 500; // Example amount
    const customerDetails = {
      customerName: "John Doe",
      customerEmail: "john.doe@example.com",
      customerPhone: "9999999999",
    };
    const paymentObj = {
      orderId,
      orderAmount,
      ...customerDetails,
    };

    try {
      // Step 1: Generate Order Token
      const response = await axios.post(
        "http://localhost:3000/api/processpayment",
        paymentObj,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const paymentSessionId = response.data.response.payment_session_id; // Extract the session ID
      console.log("Payment Session ID:", paymentSessionId);

      // Step 2: Initialize Cashfree Checkout
      let checkoutOptions = {
        paymentSessionId: paymentSessionId, // Use the session ID from the API response
        redirectTarget: "_modal",
      };

      cashfree.checkout(checkoutOptions).then((result) => {
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
          console.log("Payment completed:", result.paymentDetails.paymentMessage);
        }
      });
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
