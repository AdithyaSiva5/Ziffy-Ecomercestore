const express = require("express");
const userRouter = express.Router();
const cookieparser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const userMiddleware = require("../user-midddleware/user_authentication");
const loginControll = require("../controllers/user_controllers/login");
const signupControll = require("../controllers/user_controllers/signup");
const homepageControll = require("../controllers/user_controllers/homepage");
const productControll = require("../controllers/user_controllers/productdetails");
const forgetpassword = require("../controllers/user_controllers/forgetpassword");
const cart = require("../controllers/user_controllers/cart")
const account = require("../controllers/user_controllers/account")

userRouter.use(cookieparser());

//homepage
userRouter.get(
  "/", 
  homepageControll.getUserRoute,
  userMiddleware.verifyUser,
  userMiddleware.checkBlockedStatus
);
userRouter.get("/logout", homepageControll.getLogout);

//login
userRouter.get("/login", loginControll.getLogin);
userRouter.post("/post-login", loginControll.postLogin);

//signup
userRouter.get("/signup", signupControll.getUserSignup);
userRouter.post("/post-signup", signupControll.postUserSignup); 
userRouter.get("/send-otp", signupControll.getSendOtp);
userRouter.post("/verify-otp", signupControll.postVerifyOtp);

//products
userRouter.get(
  "/product-details/:productId",
  userMiddleware.verifyUser,
  userMiddleware.checkBlockedStatus,
  productControll.productDetails
);

//forgetpassword
userRouter.get("/forgetpassword", forgetpassword.forgetpass);
userRouter.post("/post-sentotp", forgetpassword.postforget);
userRouter.post("/post-forgetpassword", forgetpassword.postreset);


//cart
userRouter.get(
  "/cart",
  userMiddleware.verifyUser,
  cart.getcart
);
userRouter.post("/addToCart", userMiddleware.verifyUser, cart.gettocart);
userRouter.post("/update-quantity" , userMiddleware.verifyUser , cart.updateQuantity);

module.exports = userRouter;

//User account
userRouter.get(
  "/user-account",
  userMiddleware.verifyUser,
  account.getUserAccount
);
