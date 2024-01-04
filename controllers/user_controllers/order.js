const userCollection = require("../../models/user_schema");
const cartCollection = require("../../models/cart_schema");
const addressCollection = require("../../models/address_schema");
const productCollection = require("../../models/product");
const orderCollection = require("../../models/order_schema")
const razorpay = require("razorpay");
const { v4: uuidv4 } = require("uuid");

const { RAZOR_PAY_key_id, RAZOR_PAY_key_secret } = process.env;

//razorpay instance
var instance = new razorpay({
  key_id: RAZOR_PAY_key_id,
  key_secret: RAZOR_PAY_key_secret,
});

module.exports.orderViaCod = async (req,res)=>{
    try {
        user = await userCollection.findOne({email : req.user})
        const userCart = await cartCollection.findOne({ userId : user._id }).populate({path : "products.productId" , model : productCollection});
        const useraddress = await addressCollection.findOne({"address._id": req.params.addressId}, { "address.$": 1 });
         for (const product of userCart.products) {
            if (product.quantity > product.productId.productStock || product.productId.productStock == 0) {
                return res.status(200).json({ backToCart: true });
            }
        };
        const productArray = userCart.products.map((product) => ({
              productId: product.productId._id,
              price: product.productId.sellingPrice,
              quantity: product.quantity,
            }));
        
        let totalAmount = userCart.products.reduce(
          (total, product) =>
            total + product.quantity * product.productId.sellingPrice,
          0
        );
         const paymentMethod = "Cash on Delivery";
         const createdOrder = await orderCollection.create({
           userId: user._id,
           products: productArray,
           totalAmount,
           paymentMethod,
           address: useraddress,
         });

         for (const product of userCart.products){
            await productCollection.updateOne({_id : product.productId._id},{$inc : { productStock : -product.quantity}});
         }
         await cartCollection.deleteOne({ userId: user._id });
        const orderId = createdOrder._id;
        return res.status(200).json({ orderId });   

    } catch (error) {
        console.log(error);
        next(error);
    }
    
}

module.exports.getOrderPlaced = async(req,res)=>{
    try{

    const ifOrderExist = await orderCollection.findById(req.params.orderId);
    if(ifOrderExist){
      res.render('user-order-placed');
    }
  }catch(error){
    next(error);
  }
}
module.exports.viewOrders = async(req,res)=>{
  const loggedIn = req.cookies.loggedIn;
  orderId = req.query.orderId;
  let cartLength, user;
  user = await userCollection.findOne({ email: req.user });
  if(loggedIn){
    const userCart = await cartCollection.findOne({ userId : user._id })
    if(userCart &&  userCart.products){
      cartLength = userCart.products.length;
    }
  }
    const orderDetails = await orderCollection.findOne({_id : orderId}).populate({path : "products.productId" , model : productCollection});
    res.render("view-orders", {cartLength, loggedIn, orderDetails, user }); 
}

module.exports.cancelOrder = async(req,res)=>{
  try{
    const orderId = req.params.orderId;
    await orderCollection.findByIdAndUpdate(orderId, {orderStatus: 'Cancelled', paymentStatus: 'Failed'});
    res.redirect(`/view-order?orderId=${orderId}`);
  }catch (error) {
   console.log(error)
   next(error);
  }
}
module.exports.returnOrder = async (req, res, next) => {
    try {
      const orderId = req.params.orderId;
      await orderCollection.findByIdAndUpdate(orderId, {
        orderStatus: "Returned",
        paymentStatus: "Failed",
      });
      res.redirect(`/view-order/?orderId=${orderId}`);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

module.exports.orderViaOnline = async(req,res,next)=>{
      let totalAmount = 0;
      user = await userCollection.findOne({ email: req.user });
      const userCart = await cartCollection.findOne({ userId : user._id }).populate({path : "products.productId" , model : productCollection});
      const useraddress = await addressCollection.findOne({"address._id": req.params.addressId}, { "address.$": 1 });
      userCart.products.forEach(product=>{
      if(product.quantity > product.productId.productStock || product.productId.productStock == 0){
        return res.status(200).json({backToCart: true})
      }
    });
    const productArray = userCart.products.map((product) => ({
      productId: product.productId._id,
      price: product.productId.sellingPrice,
      quantity: product.quantity,
    }));
     
     userCart.products.forEach((product) => {
      totalAmount += product.productId.sellingPrice * product.quantity;
     });
     const paymentMethod = "Online Payment";

     var options = {
       amount: totalAmount*100,
       currency: "INR",
       receipt: uuidv4(),
     };
     const razorOrder = await instance.orders.create(options);

    //order creation
    const createdOrder = await orderCollection.create({
      userId: user._id,
      products: productArray,
      totalAmount,
      paymentMethod,
      address: useraddress, 
    });

    for (const product of userCart.products) {
      await productCollection.updateOne(
        { _id: product.productId._id },
        { $inc: { productStock: -product.quantity } }
      );
    }
    await cartCollection.deleteOne({ userId: user._id });
    const orderId = createdOrder._id;
    return res.status(200).json({ razorOrderId: razorOrder.id, orderId });
}

module.exports.updatePaymentStatus = async (req, res, next) => {
  try {
    const paymentStatus = req.query.paymentStatus;
    const orderId = req.query.orderId;
    await orderCollection.findByIdAndUpdate(orderId, {
      paymentStatus,
    });
    if (paymentStatus == "Success") {
      
      return res.status(200).json({ paymentStatus: "Success" });
    } else {
      const order = await orderCollection.findById(orderId);
      if (order) {
        await orderCollection.findByIdAndUpdate(orderId, {
          orderStatus: "Order Failed",
        });
        for (const product of order.products) {
          await productCollection.updateOne(
            { _id: product.productId },
            { $inc: { productStock: product.quantity } }
          );
        }
      }
      return res.status(200).json({ paymentStatus: "Failed" });
    }
  } catch (error) {
    console.log(error)
    next(error);
  }
};

module.exports.cancelSingleOrder = async(req,res) =>{
  try {    
    const orderId = req.query.orderId;
    const productId = req.query.productId;
    console.log(orderId, productId);
    res.status(200).json({ message: "The order is cancelled" });
  } catch (error) {
    
  }
}