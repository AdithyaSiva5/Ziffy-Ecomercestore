const userCollection = require("../../models/user_schema");
const productCollection = require("../../models/product");
const cartCollection = require("../../models/cart_schema");
const mongoose = require("mongoose");

module.exports.getcheckout = (req,res)=>{
    const loggedIn = req.cookies.loggedIn;
    res.render("user-checkout",{loggedIn})
}
