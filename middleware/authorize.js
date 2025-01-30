const authorizeAdmin = (req, res, next) => {
  const user = req.user;
  if (user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Forbidden - Admin Only" });
  }
};

module.exports = authorizeAdmin;
