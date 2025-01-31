const jwt = require("jsonwebtoken");
const { secretKey } = require("../config/jwt");
const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized - Missing Token" });
  }
  const [bearer, token] = authHeader.split(" ");
  if (bearer !== "Bearer" || !token) {

    return res
      .status(401)
      .json({ message: "Unauthorized - Invalid token Format" });
  }
  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden - Invalid Token" });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
