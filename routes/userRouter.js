const express = require("express");
const userRouter = express.Router();
const cookieparser = require("cookie-parser")
const jwt = require("jsonwebtoken");
const userMiddleware = require("../user-midddleware/user_authentication");
const loginControll = require('../controllers/user_controllers/login');
const signupControll = require("../controllers/user_controllers/signup")
const homepageControll = require("../controllers/user_controllers/homepage");
const productControll = require("../controllers/user_controllers/productdetails");

userRouter.use(cookieparser());

//homepage
userRouter.get("/", homepageControll.getUserRoute);
userRouter.get("/logout", homepageControll.getLogout);

//login
userRouter.get("/login",loginControll.getLogin)
userRouter.post("/post-login",loginControll.postLogin)

 
//signup
userRouter.get("/signup",signupControll.getUserSignup);
userRouter.post("/post-signup", signupControll.postUserLogin);
userRouter.get("/send-otp",signupControll.getSendOtp);
userRouter.post("/verify-otp",signupControll.postVerifyOtp)


//products
userRouter.get(
  "/product-details/:productId",
  userMiddleware.verifyUser,
  userMiddleware.checkBlockedStatus,
  productControll.productDetails
);


module.exports = userRouter;


