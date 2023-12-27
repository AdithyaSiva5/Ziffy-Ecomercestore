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
const checkoutpage = require("../controllers/user_controllers/checkout")
const address = require("../controllers/user_controllers/address")
const orders = require("../controllers/user_controllers/order")

userRouter.use(cookieparser());

//homepage
userRouter.get("/", homepageControll.getUserRoute,userMiddleware.verifyUser,userMiddleware.checkBlockedStatus);
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
userRouter.get("/product-details/:productId",userMiddleware.verifyUser,userMiddleware.checkBlockedStatus,productControll.productDetails);

//forgetpassword
userRouter.get("/forgetpassword", forgetpassword.forgetpass);
userRouter.post("/post-sentotp", forgetpassword.postforget);
userRouter.post("/post-forgetpassword", forgetpassword.postreset);


//cart
userRouter.get("/cart",userMiddleware.verifyUser,cart.getcart);
userRouter.post("/addToCart", userMiddleware.verifyUser,userMiddleware.checkBlockedStatus, cart.gettocart);
userRouter.post("/update-quantity",userMiddleware.verifyUser,userMiddleware.checkBlockedStatus,cart.updateQuantity);
userRouter.post("/remove-from-cart/:productId",userMiddleware.verifyUser,userMiddleware.checkBlockedStatus,cart.removeFromCart);

//checkout
userRouter.get("/checkout", userMiddleware.verifyUser,userMiddleware.checkBlockedStatus ,checkoutpage.getcheckout);


//orders
userRouter.get("/place-order-cod/:addressId", userMiddleware.verifyUser,userMiddleware.checkBlockedStatus , orders.orderViaCod);
userRouter.get("/order-placed/:orderId", userMiddleware.verifyUser,userMiddleware.checkBlockedStatus, orders.getOrderPlaced);
userRouter.get("/cancel-order/:orderId",userMiddleware.verifyUser,userMiddleware.checkBlockedStatus ,orders.cancelOrder)
userRouter.get("/return-order/:orderId",userMiddleware.verifyUser,userMiddleware.checkBlockedStatus ,orders.returnOrder)




//User account
userRouter.get("/user-account",userMiddleware.verifyUser,userMiddleware.checkBlockedStatus ,account.getUserAccount);
userRouter.get("/view-order",userMiddleware.verifyUser,userMiddleware.checkBlockedStatus, orders.viewOrders);


//address
userRouter.post("/post-add-address",userMiddleware.verifyUser,userMiddleware.checkBlockedStatus ,address.postAddAddress);
userRouter.post("/post-edit-address",userMiddleware.verifyUser,userMiddleware.checkBlockedStatus ,address.postEditAddress);
userRouter.get('/delete-address',userMiddleware.verifyUser,userMiddleware.checkBlockedStatus ,address.deleteAddress);

module.exports = userRouter; 