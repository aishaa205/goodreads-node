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
//ACCESS_TOKEN_SECRET matense4 t7oteha f el .env

