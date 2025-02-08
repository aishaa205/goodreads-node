const User = require("../models/user");
const bcrypt = require("bcrypt");
const sendOtpEmail = require("../utils/sendOtp");
const { generateToken, verifyToken } = require("../utils/authToken");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.registerUser = async (req, res) => {
  try {
    const saltRounds = 10; //how many times the hashing algorithm runs
    //check if existing email
    const existingUser = await User.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or username already exists" });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });
    await newUser.save();
    res.redirect(307, "/auth/send-otp?email=" + newUser.email);
  } catch (error) {
    console.log(error.message);
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
  res.status(201).json({ message: "OTP sent", user: updatedUser.email });
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

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  // const jwtId = req.user._id;
  // if(id !== jwtId){
  //   return res.status(401).json({ message: "Unauthorized" });
  // }
  const updates = req.body;

  try {
    const oldUser = await User.findById(id);

    if (!oldUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (updates.email || updates.username) {
      const existingUser = await User.findOne({
        $or: [{ email: req.body.email }, { username: req.body.username }],
        _id: { $ne: id },
      });
      console.log(existingUser);
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Email or username already exists" });
      }
    }

    if (updates.password) {
      const isMatch = await bcrypt.compare(updates.password, oldUser.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Password does not match" });
      }
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.newPassword, salt);
    }

    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (updates.email && updates.email !== oldUser.email) {
      res.redirect(307, "/auth/send-otp?email=" + updates.email);
    }
    res.status(200).json(user);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation error" });
    }
    console.log(error.message);
    res.status(500).json({ message: "Error updating user" });
  }
};

exports.getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error getting user" });
  }
};

exports.renewSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { subscriptionType, baseUrl } = req.body;
    if(!baseUrl || !subscriptionType){
      return res.status(400).json({ message: "Please provide base url and subscription type" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const priceIds = {
      monthly: "price_1QpBoAP34ybw3zK4WBk3A7y4",
      annually: "price_1QpBowP34ybw3zK4a1a804tF",
    };

    if (!priceIds[subscriptionType]) {
      return res.status(400).json({ message: "Invalid subscription type" });
    }

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceIds[subscriptionType],
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&subscriptionType=${subscriptionType}`,
      cancel_url: `${baseUrl}/cancel`,
      customer_email: user.email,
      metadata: {
        userId: user._id.toString(),
        username: user.username,
        userEmail: user.email,
        subscriptionType: subscriptionType,
      },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ message: "Error creating checkout session" });
  }
};

exports.verifySubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { sessionId, subscriptionType } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) {
      return res.status(400).json({ message: "Invalid session ID" });
    }
    
    if (session.payment_status !== 'paid') {
      return res.status(400).json({ message: "Payment not verified" });
    }

    const currentEndDate = user.subscription.endDate.getTime();

    const newEndDate = new Date(
      currentEndDate > Date.now()
        ? currentEndDate +
            (subscriptionType === "annually"
              ? 1000 * 60 * 60 * 24 * 365
              : 1000 * 60 * 60 * 24 * 30)
        : Date.now() +
            (subscriptionType === "annually"
              ? 1000 * 60 * 60 * 24 * 365
              : 1000 * 60 * 60 * 24 * 30)
    );
  
    await User.findByIdAndUpdate(id, {
      subscription: {
        subscriptionType: "premium",
        endDate: newEndDate,
      },
    });

    res.status(200).json({ message: "Payment verified successfully", endDate: newEndDate });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Error verifying payment" });
  }
};
