const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const login = require("./package/login");
const menuCategory = require("./package/menuCategory");
const restaurant = require("./package/restaurant");
const menuItem=require("./package/menuItem")
const order=require("./package/order")
const table=require("./package/table")
const app = express();
const cookieParser = require("cookie-parser");

app.use(bodyParser.json());

const corsOptions = {
  origin: "http://localhost:3000", // React app origin
  credentials: true, // Allow credentials (cookies)
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/login", login);
app.use("/restaurant", restaurant);
app.use("/menu_category", menuCategory);
app.use("/menu_item", menuItem);
app.use("/order", order);
app.use("/table", table);
app.listen(process.env.PORT || 4000, () => {
  console.log("Server is running on port 4000!");
});
