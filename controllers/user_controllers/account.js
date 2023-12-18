const userCollection = require("../../models/user_schema");

module.exports.getUserAccount = async(req,res)=>{
    const loggedIn = req.cookies.loggedIn;
    const userData = await userCollection.findOne({email: req.user})
    res.render("user-account", { loggedIn ,userData});
}