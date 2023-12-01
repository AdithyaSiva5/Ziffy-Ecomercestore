const mongoose = require("mongoose");
const multer = require("multer");

const adminCollection = require("../../models/admin_schema");

// render loging page
module.exports.getAdminLogin = (req, res) => {
  res.render("admin-login");
};

// checking details and loging
module.exports.getAdminDashboard = async (req, res) => {
  const admindata = await adminCollection.findOne({ email: req.body.email });
  if (!admindata) {
    res.render("admin-login", { subreddit: "The email is not registered" });
  } else {
    if (admindata) {
      if (req.body.email != admindata.email) {
        res.render("admin-login", { subreddit: "This email not registered" });
      } else if (req.body.password != admindata.password) {
        res.render("admin-login", { subreddit: "Incorrect password" });
      } else {
        if (
          req.body.email == admindata.email &&
          req.body.password == admindata.password
        ) {
          res.render("admin-dashboard");
        }
      }
    } else {
      res.redirect("/admin");
    }
  }
};
