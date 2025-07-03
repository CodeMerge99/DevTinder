const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("user created successfully");
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      msg: "Failed to create user",
    });
  }
});

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
app.patch("/user", async(req,res)=>{
   const UserId = req.body.UserId;
   const data = req.body;
   try {
      const userdetails = await User.findOneAndUpdate({_id:UserId}, data);
      res.status(200).json({
        sucees:true,
        msg:"User Details Updated Successfully"
      })
      
   } catch (error) {
      console.error(error.message);
      res.status(500).json({
        suceess:false,
        msg:"Failed to update User Details",

      })
   }
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
