
const express = require("express");
const { connectDB } = require("./db");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripe = require("./routes/stripe")



const app = express();
connectDB();

app.use(express.json());
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/stripe", stripe)





const PORT = process.env.PORT || 5050 ;
app.listen( PORT, () => {
    console.log(`Backend server is listening on port ${PORT}`)
})