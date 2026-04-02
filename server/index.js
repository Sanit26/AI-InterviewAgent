import dotenv from "dotenv";
dotenv.config({ path: "./.env" });  // ✅ force load

console.log("ALL ENV:", process.env);

console.log("ENV CHECK:", process.env.RAZORPAY_KEY_ID); // ✅ debug


import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDb from "./config/connectDb.js";

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import interviewRouter from "./routes/interview.route.js";
import paymentRouter from "./routes/payment.route.js";

const app = express();

console.log("Index file running ✅")

// ✅ CORS (VERY IMPORTANT)
app.use(cors({
  origin: "https://ai-interview-agent-client-idl7.onrender.com",
  credentials: true
}));

// ✅ MIDDLEWARE
app.use(express.json());
app.use(cookieParser());

// ✅ DB
connectDb();

// ✅ ROUTES
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/payment" , paymentRouter);

console.log("Payment route attached ✅");

// ✅ TEST
app.get("/", (req, res) => {
  res.send("Server working ✅");
});

// ✅ START
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

