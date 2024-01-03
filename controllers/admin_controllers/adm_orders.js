const orderCollection = require("../../models/order_schema")
const productCollection = require("../../models/product");
const userCollection = require("../../models/user_schema");

module.exports.Orders = async (req,res) =>{
try {
    let perPage = 5;
    let page = req.query.page || 1;
    const loggedIn = req.cookies.admintoken;
    if(loggedIn){

        const orderDetails = await orderCollection
          .find()
          .populate({ path: "userId", model: userCollection })
          .sort({ createdAt: -1 })
          .skip(perPage * page - perPage)
          .limit(perPage)
          .exec();
          orderDetails.reverse();
        const count = await orderCollection.countDocuments({});
        res.render("admin-orderpage", { orderDetails ,current: page, pages: Math.ceil(count / perPage)});
    }else{
        res.redirect("/admin");
    }

} catch (error) {
    console.log(error)
}
}
module.exports.viewOrder = async(req,res) =>{
    try {
    const loggedIn = req.cookies.admintoken;
    const orderId = req.params.orderId;
    if(loggedIn){

        const orderDetails = await orderCollection.findOne({_id: orderId}).populate({path:'products.productId', model: productCollection})
        res.render("admin-editorder", { orderDetails });
    }else{
        res.redirect("/admin");
    }

} catch (error) {
    console.log(error)
}
}

module.exports.dispatchOrder = async (req, res) => {
    try {
      const orderId = req.params.orderId;
      await orderCollection.findByIdAndUpdate(orderId, {
        orderStatus: "Shipped",
      });
      res.redirect(`/admin/view-order/${orderId}`);
    } catch (error) {
      console.error(error);
      next(error);
    }
};
module.exports.cancelOrder = async (req, res) => {
    try {
      const orderId = req.params.orderId;
      await orderCollection.findByIdAndUpdate(orderId, {
        orderStatus: "Cancelled",
        paymentStatus: "Failed",
      });
      res.redirect(`/admin/view-order/${orderId}`);
    } catch (error) {
      console.error(error);
      next(error);
    }
};
module.exports.deliverOrder = async (req, res) => {
    try {
      const orderId = req.params.orderId;
      await orderCollection.findByIdAndUpdate(orderId, {
        orderStatus: "Delivered",
        paymentStatus: "Success",
      });
      res.redirect(`/admin/view-order/${orderId}`);
    } catch (error) {
      console.error(error);
      next(error);
    }
};