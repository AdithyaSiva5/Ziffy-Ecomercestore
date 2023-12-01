const userCollection = require('../../models/user_schema')
const adminCollection = require("../../models/admin_schema");
const productCollection = require("../../models/product");
require('dotenv').config();
const jwt = require("jsonwebtoken")
secretkey = process.env.JWT_KEY;

//getting login page
module.exports.getLogin=(req,res)=>{
    if(req.cookies.logindata){
         res.render("/") 
    }else{
        res.render("user-login")
    }
}

module.exports.postLogin = async(req,res)=>{

    const logindata = await userCollection.findOne({ email : req.body.email});
    if(!logindata){
        res.status(200).json({ error : "Email is not Registered"});
    } else if (logindata){
        if(logindata.status === "Block"){
            res.status(200).json({error : "User is Blocked"})
        }else if(req.body.password !== logindata.password){
            res.status(200).json({error : "Incorrect Password"})
        } else {
            if(req.body.email === logindata.email && req.body.password === logindata.password){
                try {
                    email= req.body.email;
                    const token  = jwt.sign(email,secretkey);
                    res.cookie("token",token,{maxAge : 24*60*60*1000})
                    res.cookie("loggedIn",token,{maxAge : 24*60*60*1000})
                    res.status(200).json({ success: true });
                } catch (error) {
                    console.log(error);
                    res.send(500).json({error :"Internal server error"});
                }

            }else{
                res.send(200).json({error : "Invalid Credentials"})
            }
        }
    }
}