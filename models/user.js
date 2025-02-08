const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    fName: {
      type: String,
      required: [true, "Please enter a first name"], // If omitted, an error message will be thrown.
    },
    lName: {
      type: String,
      required: [true, "Please enter a last name"],
    },
    username: {
      type: String,
      required: [true, "Please enter a user name"],
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Please enter an email"],
      unique: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
        },
        //props is enter email.
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: 8,
    },
    img: {
      type: String,
      default: "http://localhost:3001/views/images/defaultPP.jpg",
    },
    role: {
      type: String,
      enum: ["user", "admin"], // Allowed values: "user" or "admin"
      default: "user", // Default value if not specified
      required: [true, "Please specify a role"],
    },
    favoriteCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    subscription: {
      subscriptionType: {
        type: String,
        enum: ["free", "premium"],
        default: "free",
        required: function () {
          return this.role === "user"; // Required only for users
        },
      },
      startDate: {
        type: Date,
        default: Date.now,
      },
      endDate: {
        type: Date,
        default: Date.now,
        required: function () {
          return (
            this.role === "user" &&
            (this.subscription.subscriptionType === "monthly" ||
              this.subscription.subscriptionType === "annualy")
          ); // Required only for users
        },
      },
    },
    emailVerified: { type: Boolean, default: false },
    otp: { type: String }, //for email verification
    otpExpiration: { type: Date }, // OTP expiration time
  },
  { timestamps: true } //add timestamp for each document,
);

const User = mongoose.model("User", userSchema);

module.exports = User;
