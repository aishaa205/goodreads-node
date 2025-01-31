const nodemailer = require("nodemailer");
async function sendOtpEmail(email, message) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "OTP for Email Verification",
    text: message,
  };
  await transporter.sendMail(mailOptions);
}
module.exports = sendOtpEmail;
