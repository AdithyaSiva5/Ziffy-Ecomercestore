const nodemailer = require('nodemailer');
require("dotenv").config();

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
};

const sendOTP = async (email, generatedOTP) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    const mailOptions = {
      from: {
        name: "Zify",
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: "Account verification mail",
      text: `Your OTP for verification is: ${generatedOTP}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email has been sent: " + info.response);
    return true; // Indicates success
  } catch (error) {
    console.error(error);
    return false; // Indicates failure
  }
};

//to verify OTP
const verifyOTP = (userOTP , generateOTP) =>{
    return userOTP === generateOTP;
}

//to send OTP
module.exports.getSendOtp = async (req, res) => {
  try {
    const email = req.query.email;
    const generatedOTP = generateOTP();
    const success = await sendOTP(email, generatedOTP);

    if (success) {
      res.status(200).json({ message: "OTP sent to email successfully" });
    } else {
      res.status(500).json({ error: "Failed to send OTP email" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.postVerifyOtp = (req, res) => {
  try {
    const { userOTP, generatedOTP } = req.body;
    const isVerified = verifyOTP(userOTP, generatedOTP);

    if (isVerified) { 
      res.status(200).json({ message: "OTP verified successfully" });
    } else {
      res.status(400).json({ error: "Invalid OTP" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.getUserSignup = (req, res) => {
  res.render("user-signup");
};