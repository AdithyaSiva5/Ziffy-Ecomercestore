const express = require("express");
const userRouter = express.Router();
const cookieparser = require("cookie-parser")
const jwt = require("jsonwebtoken");
// const userMiddleware = require("../user-midddleware/user_authentication");
// const loginControll = require('../controllers/user_controllers/login');
const signupControll = require("../controllers/user_controllers/signup")
const homepageControll = require("../controllers/user_controllers/homepage");

userRouter.use(cookieparser());

//homepage
userRouter.get("/", homepageControll.getUserRoute);
userRouter.get("/logout", homepageControll.getLogout);


//signup
userRouter.get("/signup",signupControll.getUserSignup);
userRouter.post("/post-signup", signupControll.postVerifyOtp);
userRouter.get("/send-otp",signupControll.getSendOtp);
userRouter.post("/verify-otp",signupControll.postVerifyOtp)

module.exports = userRouter;


