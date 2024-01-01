const mongoose = require("mongoose");
const multer = require("multer");
const sharp = require("sharp");
const productCollection = require("../../models/product");

module.exports.cropimage = async(req,res) =>{
    res.render("admin-cropimage");
}