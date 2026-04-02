import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import razorpay from "../services/razorpay.service.js";
import crypto from "crypto";

// ✅ CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    console.log("Create Order HIT ✅");

    const { planId, amount, credits } = req.body;

    // ✅ validation
    if (!planId || !amount || !credits) {
      return res.status(400).json({ message: "Invalid plan data ❌" });
    }

    // ✅ create razorpay order
    const options = {
      amount: amount * 100, // ₹ → paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // ✅ save in DB
    await Payment.create({
      userId: req.userId,
      planId,
      amount,
      credits,
      razorpayOrderId: order.id,
      status: "created",
    });

    // ✅ IMPORTANT: send correct response
    return res.status(200).json({
      success: true,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });

  } catch (error) {
    console.log("Create Order Error ❌:", error);
    return res.status(500).json({
      message: "Failed to create Razorpay order",
      error: error.message,
    });
  }
};


// ✅ VERIFY PAYMENT
export const verifyPayment = async (req, res) => {
  try {
    console.log("Verify Payment HIT ✅");

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // ✅ validation
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment data ❌" });
    }

    // ✅ verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature ❌" });
    }

    // ✅ find payment
    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found ❌" });
    }

    if (payment.status === "paid") {
      return res.json({ message: "Already processed ✅" });
    }

    // ✅ update payment
    payment.status = "paid";
    payment.razorpayPaymentId = razorpay_payment_id;
    await payment.save();

    // ✅ update user credits
    const updatedUser = await User.findByIdAndUpdate(
      payment.userId,
      { $inc: { credits: payment.credits } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Payment verified and credits added 🎉",
      user: updatedUser,
    });

  } catch (error) {
    console.log("Verify Payment Error ❌:", error);
    return res.status(500).json({
      message: "Failed to verify payment",
      error: error.message,
    });
  }
};

