const nodemailer = require("nodemailer");
const userCollection = require("../../models/user_schema");
const bcrypt = require("bcrypt");
const saltRounds = 10;
module.exports.forgetpass = async (req, res) => {
  res.render("forget-password");
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
      text: `Your OTP for Changing Password is: ${generatedOTP}`,
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
const verifyOTP = (userOTP, generatedOTP) => {
  return userOTP === generatedOTP;
};

module.exports.postforget = async (req, res) => {
  try {
    
    const data = await userCollection.findOne({
      email: req.body.email,
    });
    if (!data) {
      res.status(200).json({ error: "Email is not Registered" });
    } else if (req.body.password !== req.body.confirmpassword) {
      res.status(200).json({ error: "Both passwords are not the same" });
    } else {    
                // console.log("Hello");
                const generatedOTP = generateOTP();
                const email = req.body.email;
                console.log(req.body.password)
                console.log(generatedOTP);
                const success = sendOTP(email, generatedOTP);
                console.log(success);
                if (success) {
                  res
                    .status(200)
                    .json({ message: "OTP sent to email successfully" });
                } else {
                  res.status(500).json({ error: "Failed to send OTP email" });
                }
      
    }
  } catch (error) {}
};



module.exports.postreset= async(req,res)=>{
  try {
    email=req.body.email;
    password=req.body.password;
    const { userOTP, generatedOTP } = req.body;
    const isVerified = verifyOTP(userOTP, generatedOTP);

    if (isVerified) {
      res.render("user-login", { message: "Successfully Changes Password" });
      const hashedPassword = await bcrypt.hash(password, saltRounds);  
      await userCollection.updateOne(
        { email: email },
        { $set: { password: hashedPassword } }
      );    
      // res.render("user-login", { message: "User sign up successfully" });

    } else {
      res.status(400).json({ error: "Invalid OTP" });
    }
    
  } catch (error) {
    console.log(error)
  }

}