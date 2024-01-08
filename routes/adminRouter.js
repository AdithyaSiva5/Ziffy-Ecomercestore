const express = require("express");
const adminRouter = express.Router();
const multer = require("multer");
const adminMiddleware = require("../user-midddleware/admin_authentication");
const loginControll = require("../controllers/admin_controllers/adm_login");
const dashboardControll = require("../controllers/admin_controllers/adm_dashboard");
const productControll = require("../controllers/admin_controllers/adm_product");
const categoryControll = require("../controllers/admin_controllers/adm_category");
const usermanageControll = require("../controllers/admin_controllers/adm_usermanage");
const orders = require("../controllers/admin_controllers/adm_orders")
const cropImage = require("../controllers/admin_controllers/adm_cropimage")
const userError = require("../user-midddleware/error_handling");
const salesReport = require("../controllers/admin_controllers/adm_salesreport");
const dashboard = require("../controllers/admin_controllers/adm_dashboard")
const uploads = require("../user-midddleware/multer")
const coupons = require("../controllers/admin_controllers/adm_coupon")

adminRouter.use("/public/uploads", express.static("public/uploads"));
adminRouter.use("/uploads", express.static("uploads"));



//login

adminRouter.get("/", dashboard.gettoDashboard);
adminRouter.get("/admin-dashboard", adminMiddleware.verifyAdmin, dashboard.gettoDashboard);

//homepage
adminRouter.post("/admin-dash", loginControll.getAdminDashboard);

//category
adminRouter.get("/category-list",adminMiddleware.verifyAdmin,categoryControll.getCategory);
adminRouter.post(  "/add-category",  adminMiddleware.verifyAdmin,  categoryControll.postCategory);
adminRouter.get(  "/edit-category/:categoryId",  adminMiddleware.verifyAdmin,  categoryControll.editCategory); 
adminRouter.post(  "/postEdit-category/:categoryId",  adminMiddleware.verifyAdmin,   categoryControll.updateCategory);
adminRouter.get(  "/delete-category/:categoryId",  adminMiddleware.verifyAdmin,  categoryControll.deleteCategory);
adminRouter.post(  "/block-category/:categoryId",  adminMiddleware.verifyAdmin,  categoryControll.blockCategory);
adminRouter.post(  "/unblock-category/:categoryId",  adminMiddleware.verifyAdmin,  categoryControll.unblockCategory);

//product

adminRouter.get(  "/product-list",  adminMiddleware.verifyAdmin,  adminMiddleware.verifyAdmin,  productControll.getProductList);
adminRouter.get(  "/add-product",  adminMiddleware.verifyAdmin,  productControll.getAddProduct);
adminRouter.post(  "/postadd-product",  uploads.array("productImg"),  adminMiddleware.verifyAdmin,  productControll.postProduct);
adminRouter.get(  "/delete-product/:productId",  adminMiddleware.verifyAdmin,  productControll.deleteProduct);
adminRouter.get(  "/edit-product/:productId",  adminMiddleware.verifyAdmin,  productControll.editProduct);
adminRouter.post(  "/postEdit-product/:productId",  adminMiddleware.verifyAdmin,  uploads.array("productImg"),  productControll.updateProduct);
adminRouter.get(  "/block-product/:productId",  adminMiddleware.verifyAdmin,  productControll.blockProduct);
adminRouter.get(  "/unblock-product/:productId",  adminMiddleware.verifyAdmin,  productControll.unblockProduct);
adminRouter.get(  "/delete-image",  adminMiddleware.verifyAdmin,  productControll.deleteImage);

// Manage User
adminRouter.get(  "/user-manage",  adminMiddleware.verifyAdmin,  usermanageControll.getUsers);
adminRouter.get(  "/block-user/:userId",  adminMiddleware.verifyAdmin,  usermanageControll.blockUser);
adminRouter.get(  "/unblock-user/:userId",  adminMiddleware.verifyAdmin,  usermanageControll.unblockUser);


//order management
adminRouter.get("/orders", adminMiddleware.verifyAdmin, orders.Orders);
adminRouter.get("/view-order/:orderId", adminMiddleware.verifyAdmin , orders.viewOrder);
adminRouter.get("/dispatch-order/:orderId", adminMiddleware.verifyAdmin , orders.dispatchOrder);
adminRouter.get("/cancel-order/:orderId", adminMiddleware.verifyAdmin , orders.cancelOrder);
adminRouter.get("/deliver-order/:orderId", adminMiddleware.verifyAdmin , orders.deliverOrder);

//crop images
adminRouter.get("/crop/:productId", adminMiddleware.verifyAdmin, cropImage.cropimage);
adminRouter.post("/croppedimage",adminMiddleware.verifyAdmin, cropImage.PostCrop);

// salesReport
adminRouter.get("/sales-report", adminMiddleware.verifyAdmin, salesReport.salesReport);
adminRouter.post("/filter-sales",adminMiddleware.verifyAdmin, salesReport.filterSales )

//coupons
adminRouter.get("/add-coupon", adminMiddleware.verifyAdmin, coupons.getAddCoupon);
adminRouter.get("/coupons", adminMiddleware.verifyAdmin, coupons.getCoupons);
adminRouter.post("/post-add-coupon", adminMiddleware.verifyAdmin, coupons.postAddCoupon )
adminRouter.get("/edit-coupon/:coupon_id", adminMiddleware.verifyAdmin, coupons.getEditCoupon)
adminRouter.post("/post-edit-coupon/:coupon_id", adminMiddleware.verifyAdmin, coupons.postEditCoupon)
adminRouter.get("/block-coupon/:coupon_id", adminMiddleware.verifyAdmin, coupons.blockCoupon)
adminRouter.get("/unblock-coupon/:coupon_id", adminMiddleware.verifyAdmin, coupons.unblockCoupon)


//logout
adminRouter.get("/logout", usermanageControll.getlogout); 

adminRouter.use(userError.errorHandler);
adminRouter.get("/*", userError.errorHandler2);





module.exports = adminRouter;
  