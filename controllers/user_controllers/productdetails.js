const userCollection = require("../../models/user_schema");
const adminCollection = require("../../models/admin_schema");
const productCollection = require("../../models/product");
const offerCollection = require("../../models/offer_schema");


const jwt = require("jsonwebtoken");
const secretkey = process.env.JWT_KEY;

module.exports.productDetails = async(req,res)=>{
    try{
        const loggedIn = req.cookies.loggedIn;
        const Idproduct = req.params.productId;
        const productdata = await productCollection.findById({_id:Idproduct})
        const category = productdata.productCategory;
        const relatedProducts = await productCollection.find({productCategory: category});
        const offerData = await offerCollection.find({isActive: true,status: "Unblock"});
        res.render("user-productdetails", { loggedIn, productdata, offerData ,relatedProducts});
        

    }catch(error){
        console.log(error);
        next(error);
    }
}
module.exports.productFulldetails = async(req,res)=>{
    try {
        const loggedIn = req.cookies.loggedIn;
        const productdata = await productCollection.find();
        const unblockedProducts = productdata.filter(product => product.productStatus !== 'Block');
        res.render("products-page", { loggedIn, productdata: unblockedProducts });
        
    } catch (error) {
        
    }
}