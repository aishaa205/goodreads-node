const User = require("../models/user");
const bcrypt = require("bcrypt");
const { generateToken, verifyToken } = require("../utils/authToken");

exports.registerUser = async (req, res) => {
  try {
    const saltRounds = 10; //how many times the hashing algorithm runs
    req.body.role = "user";
    //check if existing email
    const existingUser = await User.findOne({ email: req.body.email }); 
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json({ message: "User created", user: savedUser });
  } catch (error) {
    res.status(500).send("Error creating user");
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }); //get user with specific email from DB.
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password); //compare entered password with hashed password in db.
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = generateToken(user);
    res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in user" });
  }
};

exports.verifyToken = async (req, res) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized - Missing Token" });
  }
  const [bearer, token] = authHeader.split(" ");
  if (bearer !== "Bearer" || !token) {
    //if no token or incorrect Bearer.
    return res
      .status(401)
      .json({ message: "Unauthorized - Invalid Token Format" });
  }
  const decodedUser = verifyToken(token);
  if (!decodedUser) {
    return res.status(401).json({ message: "Unauthorized - Invalid Token" });
  }
  res.status(200).json({ message: "Token verified successfully", decodedUser });
};
