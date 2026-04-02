import React, { useState } from 'react'
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { motion } from "motion/react";
import axios from 'axios';
import { ServerUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function Pricing() {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [loadingPlan, setLoadingPlan] = useState(null);
  const dispatch = useDispatch()

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
      credits: 100,
      default: true,
    },
    {
      id: "basic",
      name: "Starter Pack",
      price: "₹100",
      credits: 150,
    },
    {
      id: "pro",
      name: "Pro Pack",
      price: "₹500",
      credits: 650,
    },
  ];

  // ✅ PAYMENT FUNCTION
  const handlePayment = async (plan) => {
    try {
      setLoadingPlan(plan.id)

      const amount =
        plan.id === "basic" ? 100 :
        plan.id === "pro" ? 500 : 0;

      // ✅ CREATE ORDER
      const result = await axios.post(
        ServerUrl + "/api/payment/order",
        {
          planId: plan.id,
          amount: amount,
          credits: plan.credits,
        },
        { withCredentials: true }
      );

      console.log("Order:", result.data);

      // ✅ RAZORPAY OPTIONS
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: result.data.amount,
        currency: "INR",
        name: "InterviewIQ.AI",
        description: `${plan.name} - ${plan.credits} Credits`,
        order_id: result.data.id,

        // ✅ SUCCESS HANDLER (FIXED)
        handler: async function (response) {
          try {
            console.log("Payment Response:", response);

            const verifyRes = await axios.post(
              ServerUrl + "/api/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { withCredentials: true }
            );

            console.log("Verify:", verifyRes.data);

            dispatch(setUserData(verifyRes.data.user));

            alert("Payment Successful 🎉 Credits Added!");
            navigate("/");

          } catch (error) {
            console.log("Verify Error:", error);
            alert("Payment verification failed ❌");
          }
        },

        // ✅ HANDLE CLOSE
        modal: {
          ondismiss: function () {
            alert("Payment cancelled ❌");
          }
        },

        theme: {
          color: "#10b981",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      setLoadingPlan(null);

    } catch (error) {
      console.log("Order Error:", error);
      alert("Payment failed ❌");
      setLoadingPlan(null);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center gap-10'>

      {plans.map((plan) => {
        const isSelected = selectedPlan === plan.id;

        return (
          <div key={plan.id} className='border p-6 rounded-xl'>

            <h2>{plan.name}</h2>
            <h3>{plan.price}</h3>
            <p>{plan.credits} Credits</p>

            {!plan.default && (
              <button
                disabled={loadingPlan === plan.id}
                onClick={() => handlePayment(plan)}
              >
                {loadingPlan === plan.id ? "Processing..." : "Proceed to Pay"}
              </button>
            )}
          </div>
        );
      })}
    </div>
  )
}

export default Pricing
