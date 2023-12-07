const nodemailer = require("nodemailer");
const userCollection = require("../../models/user_schema");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports.postUserSignup = async (req, res) => {
  try {
    const email = await userCollection.findOne({ email: req.body.email });
    const phoneNumber = await userCollection.findOne({
      phoneNumber: req.body.phoneNumber,
    });
    const password = req.body.password;

    if (email) {
      res.status(200).json({ error: "Email already Exist" });
    } else if (phoneNumber) {
      res.status(200).json({ error: "Phone Number Already Exists" });
    } else {
          bcrypt.hash(password, saltRounds, async(err, hash)=>{
      if(err){
        console.error('Error hashing password:', err);
        return;
      }
      await userCollection.create({
        username: req.body.username,
        password: hash,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        status: "Unblock",
      });
      res.render("user-login", { message: "User sign up successfully" });
    });
    }
  } catch (error) {
    console.log(error);
  }
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = async (email, generatedOTP) => {
  try { 
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
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
const verifyOTP = (userOTP, generateOTP) => {
  return userOTP === generateOTP;
  
};

//to send OTP
module.exports.getSendOtp = async (req, res) => {
  try {
        const email1 = req.query.email;
        const email= await userCollection.findOne({ email: req.query.email });
        const phoneNumber= await userCollection.findOne({
          phoneNumber: req.query.phoneNumber,
        });
        console.log(email+phoneNumber)
        if(email){
          res.status(200).json({ error: "Email already Exist" });
        }else if(phoneNumber){
          res.status(200).json({ error: "Number already Exist" });
        }else{

          const generatedOTP = generateOTP();
          const success = await sendOTP(email1, generatedOTP);
          if (success) {
            res.status(200).json({ message: "OTP sent to email successfully" });
          } else {
            res.status(500).json({ error: "Failed to send OTP email" });
          }
        }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.postVerifyOtp = (req, res) => {
  try {
    const { userOTP, generatedOTP } = req.body;
    console.log(userOTP)
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
