const express = require("express");
const app = express();
const mongoose =  require("mongoose");
const helmet = require( "helmet");
const morgan =  require("morgan");
const dotenv = require("dotenv");
const usersRoute = require("./routes/users");
const authRoute = require("./routes/auth");

 dotenv.config();

 //connect mongodb
 mongoose.set('strictQuery', false)
 mongoose.connect(process.env.MONGO_URL, ()=>{
    console.log("Connected to mongoDB");
 });


 //middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", usersRoute);
app.use("/api/auth", authRoute);

//listen to port 3000
app.listen(3000, ()=>{
    console.log("Backend server is running");
})