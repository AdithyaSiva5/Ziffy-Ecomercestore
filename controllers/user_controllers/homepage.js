const productCollection = require("../../models/product")

//homepage
module.exports.getUserRoute = async (req,res) => {
    try{
        const loggedIn = req.cookies.loggedIn;
        const productdata = await productCollection.find()
        const unblockedProducts = productdata.filter(product => product.productStatus !== 'Block');
        res.render("userIndex",{loggedIn,productdata : unblockedProducts});
    }catch(error){
        console.error(error);
        next(error);
    }
}


//logout
module.exports.getLogout = (req,res) =>{
res.clearCookie("token")
res.clearCookie("loggedIn")
res.redirect("/login")
}

