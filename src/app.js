const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const{userAuth} = require("./middlewares/auth");


app.use(express.json());
//cookie-parser//
app.use(cookieParser());



//login api//
app.post("/login",async(req,res)=>{
  const {emailId,password} = req.body;
  const user = await User.find({emailid:emailId});
  if(!user){
    throw new Error("EmailId is Not valid");
  }

  const ispasswordvalid = await bcrypt.compare(password, user.password);

  if(ispasswordvalid){
   




    res.cookie("token","fjbsdkfnsdlf");
    res.send("Login successful");
  }else{
    throw new Error("invalid Password");
  }
})


//profile api//
app.post("/profile",userAuth,async(req,res)=>{
   const cookies = req.cookies;
   console.log(cookies);
   res.send("Reading cookies");
})





//get user by emailId;
app.get("/user", async (req, res) => {
  const Useremail = req.body.email;
  try {
    const useremail =  await User.find({ email: Useremail });
    res.send(useremail);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      msg: "Something Went wrong",
    });
  }
});


//deleting a user by there id//
app.delete("/user", async (req, res) => {
  const UserId = req.body.UserId;
  try {
    const userid = await User.findByIdAndDelete(UserId);
    res.status(200).json({
      data: userid,
      success: true,
      msg: "User Deleted Successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      suceess: false,
      msg: "Error deleting the User",
    });
  }
});


//update the user data//
app.patch("/user", async (req, res) => {
  const UserId = req.params?.UserId;
  const data = req.body;
  const ALLOWED_UPDATES = ["photoUrl", "about", "age", "skills"];
  
  try {
    const isUpdateAllowed = Object.keys(data).every((k) => {
    ALLOWED_UPDATES.includes(k);
  });
  if (!isUpdateAllowed) {
     throw new Error("Update Not Allowed")
  }
  if(data?.skills.length > 10){
    throw new Error("More than 10 Skills cannot be added")
  }
    const userdetails = await User.findOneAndUpdate({ _id: UserId }, data, {
      runValidators: true,
    });
    res.status(200).json({
      sucees: true,
      msg: "User Details Updated Successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      suceess: false,
      msg: "Failed to update User Details",
    });
  }
});

//sendconnection request//
app.post("/sendconnectionrequest",userAuth, async(req,res)=>{
   res.send("connection request sent");
})


connectDB()
  .then(() => {
    console.log("DataBase Connection Successfull");
    app.listen(7777, () => {
      console.log("Server is listening on Port No:7777");
    });
  })
  .catch((err) => {
    console.err("Error Connecting to Database");
  });
