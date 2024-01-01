const addressCollection = require("../../models/address_schema");
const orderCollection = require("../../models/order_schema");
const userCollection = require("../../models/user_schema");
const productCollection = require("../../models/product");
const cartCollection = require("../../models/cart_schema");



module.exports.getUserAccount = async(req,res)=>{
    try {
        const loggedIn = req.cookies.loggedIn;
        if(!loggedIn){
            res.redirect("/");
        }
        const user = await userCollection.findOne({email : req.user})
        const userData = await userCollection.findOne({ email: req.user });
        const userCart = await cartCollection.findOne({ userId : user._id})
        let cartLength;
        if(userCart && userCart.products){
            cartLength = userCart.products.length;
        }else{
            cartLength = 0;
        }
        const userAddress = await addressCollection.findOne({userId : user._id})
        const userOrders = await orderCollection.find({ userId: user._id });
        
        res.render("user-account", { loggedIn, userData ,userCart ,userAddress, userOrders ,cartLength});
        
        
    } catch (error) {
        console.log(error);
        next(error);
        
    }
    
}