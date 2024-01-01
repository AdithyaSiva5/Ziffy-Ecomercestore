const userCollection = require("../../models/user_schema");
const productCollection = require("../../models/product");
const cartCollection = require("../../models/cart_schema");
const mongoose = require("mongoose");
const addressCollection = require("../../models/address_schema");
 
const calculateTotalPrice = (cart) => {
  let total = 0;
  for (const items of cart.products) {
    const subtotal = items.quantity * items.productId.sellingPrice;
    total += subtotal;
  }

  return total;
};

module.exports.getcheckout = async (req, res) => {
  try {
    let grandTotal = 0;
    const loggedIn = req.cookies.loggedIn;
    const userData = await userCollection.findOne({ email: req.user });
    const userCart = await cartCollection.findOne({ userId: userData._id }).populate({ path: "products.productId", model: productCollection });
    const userAddress = await addressCollection.findOne({ userId : userData._id});
    if (!userCart || !userCart.products || userCart.products.length === 0) {
      return res.redirect("/cart")
    }
     grandTotal = calculateTotalPrice(userCart);
    res.render("user-checkout", { loggedIn, userCart, grandTotal ,userAddress});
    
  } catch (error) {
    console.log(error)
  }
};

module.exports.stockchecking = async(req,res) =>{
  try {
    const userData = await userCollection.findOne({ email: req.user });
    const userCart = await cartCollection.findOne({ userId: userData.id }).populate({path: "products.productId",model: productCollection,});
     if (userCart && userCart.products.length > 0) {
       const hasZeroStock = userCart.products.some(
         (product) => product.productId.productStock === 0
       );

       if (hasZeroStock) {
          res.status(400).json({ message: "Some products in your cart are out of stock." });
       } else {
         res.redirect("/checkout");
       }
     } else {
       res.status(400).send("Your cart is empty.");
     }
  } catch (error) {
    console.log(error)
  }
}