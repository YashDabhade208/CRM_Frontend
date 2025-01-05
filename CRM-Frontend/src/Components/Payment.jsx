import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../Config/apiConfig";
import { CheckCircle } from "lucide-react";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();
  const [prices, setPrices] = useState([]);
  const [orderAmount, setOrderAmount] = useState(100);
  const [orderStatus, setOrderStatus] = useState(null);
  const [newOrderId, setNewOrderId] = useState();

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
    const fetchPrices = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/getprices`, {
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
      const newOrderId = response.data.response.order_id;
      setNewOrderId(newOrderId);

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
      }
    } catch (error) {
      console.error("Payment initiation failed", error);
    }
    try {

      console.log("orderId while getting order status", newOrderId);
      const statusResponse = await axios.post('https://crm-backend-yash208.vercel.app/getorderstatus', {
        orderId: newOrderId,
      });
      setOrderStatus(statusResponse.data.orderStatus);
      console.log("orderStatus:", statusResponse.data.orderStatus);

    } catch (error) {
      console.error("Payment initiation failed", error);
    }

  }



return (
  <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
    <h1 className="text-3xl font-bold mb-6 text-gray-800">
      Cashfree Payment Integration
    </h1>

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
);
};

export default Payment;
