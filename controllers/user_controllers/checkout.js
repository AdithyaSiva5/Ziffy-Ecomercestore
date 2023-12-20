const userCollection = require("../../models/user_schema");
const productCollection = require("../../models/product");
const cartCollection = require("../../models/cart_schema");
const mongoose = require("mongoose");

const calculateTotalPrice = (cart) => {
  let total = 0;
  for (const items of cart.products) {
    const subtotal = items.quantity * items.productId.sellingPrice;
    total += subtotal;
  }

  return total;
};

 
module.exports.getcheckout = async (req, res) => {
  const loggedIn = req.cookies.loggedIn;
  const userData = await userCollection.findOne({ email: req.user });
  console.log(userData._id);
  const cart = await cartCollection.findOne({ userId: userData._id });
  console.log(`cart is : ${cart}`)

  res.render("user-checkout", { loggedIn });
};

