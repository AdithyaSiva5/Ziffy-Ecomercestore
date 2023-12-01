const express = require("express");
const adminRouter = express.Router();
const multer = require("multer");
const loginControll = require("../controllers/admin_controllers/adm_login");
const dashboardControll = require("../controllers/admin_controllers/adm_dashboard");
const productControll = require("../controllers/admin_controllers/adm_product");
const categoryControll = require("../controllers/admin_controllers/adm_category");
const usermanageControll = require("../controllers/admin_controllers/adm_usermanage");

adminRouter.use("/public/uploads", express.static("public/uploads"));
adminRouter.use("/uploads", express.static("uploads"));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const uploads = multer({ storage: storage });
//login
adminRouter.get("/", loginControll.getAdminLogin);

//homepage
adminRouter.post("/admin-dash", (req, res) => {
  res.render("admin-dashboard");
});
adminRouter.post("/index", loginControll.getAdminDashboard);
//category
adminRouter.get("/category-list", categoryControll.getCategory);
adminRouter.post("/add-category", categoryControll.postCategory);
adminRouter.get("/edit-category/:categoryId", categoryControll.editCategory);
adminRouter.post(
  "/postEdit-category/:categoryId",
  categoryControll.updateCategory
);
adminRouter.get(
  "/delete-category/:categoryId",
  categoryControll.deleteCategory
);
adminRouter.post("/block-category/:categoryId", categoryControll.blockCategory);
adminRouter.post(
  "/unblock-category/:categoryId",
  categoryControll.unblockCategory
);

//product

adminRouter.get("/product-list", productControll.getProductList);
adminRouter.get("/add-product", productControll.getAddProduct);
adminRouter.post(
  "/postadd-product",
  uploads.array("productImg"),
  productControll.postProduct
);
adminRouter.get("/delete-product/:productId", productControll.deleteProduct);
adminRouter.get("/edit-product/:productId", productControll.editProduct);
adminRouter.post(
  "/postEdit-product/:productId",
  uploads.array("productImg"),
  productControll.updateProduct
);
adminRouter.get("/block-product/:productId", productControll.blockProduct);
adminRouter.get("/unblock-product/:productId", productControll.unblockProduct);
adminRouter.get("/delete-image", productControll.deleteImage);

// Manage User
adminRouter.get("/user-manage", usermanageControll.getUsers);
adminRouter.get("/block-user/:userId", usermanageControll.blockUser);
adminRouter.get("/unblock-user/:userId", usermanageControll.unblockUser);

module.exports = adminRouter;
