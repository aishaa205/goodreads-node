const jwt = require('jsonwebtoken');
const User = require('../models/user');


const authenticate = async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).send({ message: "Unauthorized: No token provided" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded._id);
      if (!user) {
        throw new Error();
      }
      req.user = user; 
      next();
    } catch (error) {
      res.status(401).send({ message: "Unauthorized: Invalid token" });
    }
  };


  module.exports = { authenticate };

// const jwt = require("jsonwebtoken");

// const authMiddleware = (req, res, next) => {
//     const token = req.header("Authorization");

//     if (!token) {
//         return res.status(401).json({ message: "Access denied. No token provided." });
//     }

//     try {
//         const verified = jwt.verify(token.replace("Bearer ", ""), process.env.ACCESS_TOKEN_SECRET);
//         req.user = verified;
//         next();
//     } catch (error) {
//         res.status(400).json({ message: "Invalid token." });
//     }
// };

// module.exports = authMiddleware;
