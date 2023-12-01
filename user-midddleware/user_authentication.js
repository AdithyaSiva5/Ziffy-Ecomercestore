const userCollection = require("../models/user-schema");
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser");
require("dotenv").config();

module.exports.verifyUser = (req,res,next)=>{
    const token = req.cookies.token;
    const verifyToken = jwt.verify(token, process.env.JWT_KEY,(err,decoded)=>{
        if(err){
            return res.redirect("/login")
        }
        req.user = decoded;
        next();
    });

}

module.exports.checkBlockedStatus = async (req,res,next) =>{
    try{
        const userId = req.user._id;
        const user = await userCollection.findById(userId);

        if(user.status === "Block"){
            res.clearCookie("token");
            res.clearCookie("loggedIn");
            return res.status(403).render("user-login",{subreddit : "Your acc has been blocked"})
        }
    next();
    }catch(error){
        console.log(error)
        res.status(500).send("Internal Server Error");
    }

};