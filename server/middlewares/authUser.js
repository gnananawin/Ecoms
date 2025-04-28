import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "Access denied. Token missing." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return res.status(401).json({ success: false, message: "Access denied. Invalid token." });
  }
};

export default authUser;
