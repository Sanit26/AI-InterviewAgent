import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { createOrder, verifyPayment } from "../controllers/payment.controller.js"

const paymentRouter = express.Router()

console.log("Payment route loaded ✅") // 👈 ADD THIS

paymentRouter.post("/order", isAuth, createOrder)
paymentRouter.post("/verify", isAuth, verifyPayment)

export default paymentRouter

