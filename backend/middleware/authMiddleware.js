import jwt from "jsonwebtoken";
import UserModel from "../Models/UserModel.js";

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extract Bearer token from header
      token = req.headers.authorization.split(" ")[1];

      // Decode and verify signature using JWT_SECRET_KEY
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      // Attach matching MongoDB user to request (excluding password hash)
      req.user = await UserModel.findById(decoded.id || decoded._id).select("-password");
      
      // Fallback search by email if ID structure is legacy or different
      if (!req.user && decoded.email) {
        req.user = await UserModel.findOne({ email: decoded.email }).select("-password");
      }

      if (!req.user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      next();
    } catch (error) {
      console.error("Authentication middleware validation failure:", error);
      return res.status(401).json({ message: "Not authorized, token failed verification" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

export { protect };
