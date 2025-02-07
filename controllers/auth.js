const User = require("../models/user");
const bcrypt = require("bcrypt");
const sendOtpEmail = require("../utils/sendOtp");
const { generateToken, verifyToken } = require("../utils/authToken");

exports.registerUser = async (req, res) => {
  try {
    const saltRounds = 10; //how many times the hashing algorithm runs
    //check if existing email
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });
    await newUser.save();
    res.redirect(307, "/auth/send-otp?email=" + newUser.email);
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
    if (!user.emailVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your email before logging in" });
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

exports.sendOTP = async (req, res) => {
  console.log(req.query);
  //generate otp
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  const foundUser = await User.findOne({ email });
  if (!foundUser) {
    return res.status(400).json({ message: "This email is not registered" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); //6 digit otp
  const otpExpiration = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration
  const updateData = {
    otp,
    otpExpiration,
  };
  const updatedUser = await User.findByIdAndUpdate(foundUser._id, updateData, {
    new: true, //findByIdAndUpdate will return the updated Document, true is the default value.
    runValidators: true, //if there is validators in schema check if the new data pass the validators.
  });
  //send otp to user email
  const otpMessage = `Your One-Time Password (OTP) is: ${otp}. 
   It is valid for 5 minutes. For security reasons, 
   do not share this code with anyone.`;

  await sendOtpEmail(foundUser.email, otpMessage);
  updatedUser.otp = undefined;
  res.status(201).json({ message: "User created", user: updatedUser });
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp, type } = req.body;
    const user = await User.findOne({ email });
    console.log(user.otp, otp, email);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (user.otpExpiration < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }
    user.emailVerified = true;
    user.otp = undefined;
    user.otpExpiration = undefined;
    if(type && type === "password"){
      user.changePassword = true
    }
    await user.save();
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error verifying OTP" });
  }
};

exports.forgetPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    console.log(user)
    if (!user.changePassword) {
      return res
        .status(400)
        .json({ message: "Please make a request to change your password" });
    }
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    user.password = hashedPassword;
    user.changePassword = false
    await user.save();
    res.status(200).json({ message: "User password updated", user });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP" });
  }
};
