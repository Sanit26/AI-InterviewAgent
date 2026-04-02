import dotenv from "dotenv";
dotenv.config();  // ✅ add this ALSO

import Razorpay from "razorpay";

console.log("RAZORPAY KEY:", process.env.RAZORPAY_KEY_ID);

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("Razorpay keys missing in .env ❌");
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default razorpay;