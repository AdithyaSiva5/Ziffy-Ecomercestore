const mongoose = require("mongoose")
const orderCollection = require("../../models/order_schema")

module.exports.salesReport = async(req,res) =>{
    try {
        const orderData = await orderCollection.find({ orderStatus : "Delivered"});
        res.render("admin-salesReport",{orderData})
    } catch (error) {
        console.log(error)     
        next(error);   
    }
}
module.exports.filterSales = async(req,res) =>{
    try {
        const startDate = new Date(req.body.startDate);
        let endDate = req.body.endDate ? new Date(req.body.endDate) : null;
        
          if (!endDate) {
            const orderData = await orderCollection.find({
              orderStatus: "Delivered",
              orderDate: { $gte: startDate },
            });
            res.render("admin-salesReport", { orderData});

    }else{
        const orderData = await orderCollection.find({
          orderStatus: "Delivered",
          orderDate: { $gte: startDate, $lte: endDate },
        });
        res.render("admin-salesReport",{orderData})
        }
        
    } catch (error) {
        console.log(error)
        next(error);
        
    }
}

