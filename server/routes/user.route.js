import express from "express";

const router = express.Router();

console.log("User route loaded ✅");

// ✅ NO AUTH FOR NOW (to avoid error)
router.get("/current-user", (req, res) => {
  res.json({
    success: true,
    message: "User API working ✅"
  });
});

export default router;

