const mongoose = require("mongoose");
const multer = require("multer");
const sharp = require("sharp");
const productCollection = require("../../models/product");

module.exports.cropimage = async(req,res) =>{
    const productId = req.params.productId;
    const productdata = await productCollection.findOne({ _id: productId });
    console.log(productdata)
    res.render("admin-cropimage", {productdata});
}
module.exports.PostCrop = async(req,res)=>{
    try {
 const { croppedImage } = req.body;
   const base64Data = croppedImage.replace(/^data:image\/png;base64,/, "");
   console.log("Base64 data extracted");

   const filename = `cropped_${Date.now()}.png`;
   console.log("Filename generated:", filename);

//    const filePath = path.join(__dirname, "../../uploads", filename);
//    console.log("File path specified:", filePath);

//    fs.writeFileSync(filePath, base64Data, "base64");
//    console.log(`Cropped image saved to: ${filePath}`);

    // Respond with success
    res.status(200).json({ message: "Cropped image received successfully.", filePath });
  } catch (error) {
}
}