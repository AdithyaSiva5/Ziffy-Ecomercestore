const mongoose = require("mongoose") 

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userCollection",
    required: true,
  },
  products:[
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "productCollection",
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  orderDate: {
    type: Date,
    default: Date.now,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  orderStatus: {
    type: String,
    enum: ["Order Placed", "Shipped", "Delivered", "Cancelled", "Returned"],
    default: "Order Placed",
  },
  paymentStatus: {
    type: String,
    enum: ["Pending","Success","Failed"],
    default: "Pending",
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  address: {
    type: Object,
    required: true,
  },
  cancelReason: {
    type: String,
  }
},
{ timestamps: true }
);

const orderCollection = mongoose.model("orderCollection", orderSchema)
module.exports = orderCollection;