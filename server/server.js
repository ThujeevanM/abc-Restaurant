// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const login = require("./package/login");
// const menuCategory = require("./package/menuCategory");
// const restaurant = require("./package/restaurant");
// const menuItem=require("./package/menuItem")
// const order=require("./package/order")
// const table=require("./package/table")
// const tableReservation= require("./package/tableReservation")
// const app = express();
// const cookieParser = require("cookie-parser");

// app.use(bodyParser.json());

// const corsOptions = {
//   origin: "http://localhost:3000", // React app origin
//   credentials: true, // Allow credentials (cookies)
// };

// app.use(cors(corsOptions));
// app.use(express.json());
// app.use(cookieParser());

// app.use("/login", login);
// app.use("/restaurant", restaurant);
// app.use("/menu_category", menuCategory);
// app.use("/menu_item", menuItem);
// app.use("/order", order);
// app.use("/table", table);
// app.use("/reservation", tableReservation);
// app.listen(process.env.PORT || 4000, () => {
//   console.log("Server is running on port 4000!");
// });

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const login = require("./package/login");
const menuCategory = require("./package/menuCategory");
const restaurant = require("./package/restaurant");
const menuItem = require("./package/menuItem");
const order = require("./package/order");
const table = require("./package/table");
const tableReservation = require("./package/tableReservation");
const profile = require("./package/profile");
const specialOffer = require("./package/specialOffer");
const image= require('./package/image')
const contact=require('./package/contactUs')
const inquiry=require('./package/inquiry')
const app = express();

// Configure CORS
const corsOptions = {
  origin: "http://localhost:3000", // React app origin
  credentials: true, // Allow credentials (cookies)
};
app.use(cors(corsOptions));

// Increase payload size limits
app.use(express.json({ limit: '10mb' })); // Increase the size limit as needed
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(cookieParser());

// Define routes
app.use("/login", login);
app.use("/restaurant", restaurant);
app.use("/menu_category", menuCategory);
app.use("/menu_item", menuItem);
app.use("/order", order);
app.use("/table", table);
app.use("/reservation", tableReservation);
app.use("/profile", profile);
app.use("/offer", specialOffer);
app.use("/image", image);
app.use('/contact',contact);
app.use('/inquiry',inquiry);
// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});

