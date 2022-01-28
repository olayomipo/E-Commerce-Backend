
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const url = process.env.MONGO_URL;

async function connectDB(){
    mongoose.connect(url, (err) => {
        if (err) {
            console.log(err.message);
        }
        else {
            console.log(`DB connected @ ${url}`);
        }
    });
}

module.exports.connectDB = connectDB