const jwt = require("jsonwebtoken");

const secretKey = process.env.SECRET_KEY;
const expiresIn = "3h";
const generateToken = (user) => {
  const payload = {
    id: user._id,
    fName: user.fName,
    lName: user.lName,
    username: user.username,
    email: user.email,
    img: user.img,
    role: user.role,
  };


  return jwt.sign(payload, secretKey, { expiresIn: expiresIn }); //return Token that contains userData.
};

//refreshes token for 6hrs,
const refreshToken = (user) => { 
  const payload = {
    id: user._id,
    fName: user.fName,
    lName: user.lName,
    username: user.username,
    email: user.email,
    img: user.img,
    role: user.role,
  };
  return jwt.sign(payload, secretKey, { expiresIn: expiresIn }); //return Token that contains userData.
};

const verifyToken=(token)=>{
  try {
    const decodedUser=jwt.verify(token, secretKey);
    return decodedUser;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

module.exports = { generateToken, refreshToken, verifyToken };

