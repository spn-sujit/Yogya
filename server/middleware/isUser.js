import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
     return  res.json({
        success: false,
        message: "Not authorized,Login Again",
      });
    }

    
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
      return  res.json({ success: false, message: "User no longer exists. Login again" });
      }

      
      req.userId = decoded.id;
      next();
  
   
    
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token is invalid or expired.",
    });
  }
};

export default protect;
