const express = require("express");
const adminRouter = express.Router();
const multer = require("multer");
const adminMiddleware = require("../user-midddleware/admin_authentication");
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

adminRouter.get("/", loginControll.getAdminLogin, adminMiddleware.verifyAdmin);
adminRouter.get(
  "/admin-dashboard",
  adminMiddleware.verifyAdmin,
  loginControll.gettoDashboard
);

//homepage
adminRouter.post("/admin-dash", loginControll.getAdminDashboard);

//category
adminRouter.get(
  "/category-list",
  adminMiddleware.verifyAdmin,
  categoryControll.getCategory
);
adminRouter.post(
  "/add-category",
  adminMiddleware.verifyAdmin,
  categoryControll.postCategory
);
adminRouter.get(
  "/edit-category/:categoryId",
  adminMiddleware.verifyAdmin,
  categoryControll.editCategory
);
adminRouter.post(
  "/postEdit-category/:categoryId",
  adminMiddleware.verifyAdmin, 
  categoryControll.updateCategory
);
adminRouter.get(
  "/delete-category/:categoryId",
  adminMiddleware.verifyAdmin,
  categoryControll.deleteCategory
);
adminRouter.post(
  "/block-category/:categoryId",
  adminMiddleware.verifyAdmin,
  categoryControll.blockCategory
);
adminRouter.post(
  "/unblock-category/:categoryId",
  adminMiddleware.verifyAdmin,
  categoryControll.unblockCategory
);

//product

adminRouter.get(
  "/product-list",
  adminMiddleware.verifyAdmin,
  adminMiddleware.verifyAdmin,
  productControll.getProductList
);
adminRouter.get(
  "/add-product",
  adminMiddleware.verifyAdmin,
  productControll.getAddProduct
);
adminRouter.post(
  "/postadd-product",
  uploads.array("productImg"),
  adminMiddleware.verifyAdmin,
  productControll.postProduct
);
adminRouter.get(
  "/delete-product/:productId",
  adminMiddleware.verifyAdmin,
  productControll.deleteProduct
);
adminRouter.get(
  "/edit-product/:productId",
  adminMiddleware.verifyAdmin,
  productControll.editProduct
);
adminRouter.post(
  "/postEdit-product/:productId",
  adminMiddleware.verifyAdmin,
  uploads.array("productImg"),
  productControll.updateProduct
);
adminRouter.get(
  "/block-product/:productId",
  adminMiddleware.verifyAdmin,
  productControll.blockProduct
);
adminRouter.get(
  "/unblock-product/:productId",
  adminMiddleware.verifyAdmin,
  productControll.unblockProduct
);
adminRouter.get(
  "/delete-image",
  adminMiddleware.verifyAdmin,
  productControll.deleteImage
);

// Manage User
adminRouter.get(
  "/user-manage",
  adminMiddleware.verifyAdmin,
  usermanageControll.getUsers
);
adminRouter.get(
  "/block-user/:userId",
  adminMiddleware.verifyAdmin,
  usermanageControll.blockUser
);
adminRouter.get(
  "/unblock-user/:userId",
  adminMiddleware.verifyAdmin,
  usermanageControll.unblockUser
);

//logout
adminRouter.get("/admin/logout", usermanageControll.getlogout);

module.exports = adminRouter;
  