const mongoose = require("mongoose");

const connectDB = async () =>{
     await mongoose.connect("mongodb+srv://Piyush:Piyush%402799@cluster1.hescuwz.mongodb.net/DevTinder");
}



module.exports = connectDB;
