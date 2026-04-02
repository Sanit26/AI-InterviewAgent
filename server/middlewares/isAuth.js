import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "Not Authorized ❌" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;

    next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid Token ❌" });
  }
};

export default isAuth;

