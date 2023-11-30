require("dotenv").config();
require("events").EventEmitter.defaultMaxListeners = 15;
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieparser = require("cookie-parser");
const session = require("express-session");
const nocache = require("nocache");
const { v4: uuidv4 } = require("uuid");

const adminRouter = require("./routes/adminRouter");
const userRouter = require("./routes/userRouter");

const app = express();

app.use(nocache());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");
app.use("/uploads", express.static("uploads"));
app.set("views", [
  path.join(__dirname, "/views/admin_views"),
  path.join(__dirname, "/views/user_views"),
]);

app.use(
  session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/", userRouter);
app.use("/admin", adminRouter);

const PORT = process.env.PORT || 3000;
const MONGO = process.env.MONGO || "mongodb://127.0.0.1:27017/zifyshopping";

app.listen(PORT, async (req, res) => {
  try {
    await mongoose.connect(MONGO);
    console.log("SERVER CONNECTED");
    console.log(`http://localhost:${PORT}`);
  } catch (err) {
    console.log(err);
  }
});
