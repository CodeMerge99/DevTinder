const express = require("express");
const userRouter = express.Router();
const { userAuth} = require("../middlewares/auth");

const ConnectionRequest = require("../models/connectionRequest");

const SAFE_USER_DATA = "firstName lastName" //alternate way to write populate in terms of strings

//get all the pending connection request for logged in user//

userRouter.get("/user/request/received", userAuth , async (req,res)=>{
   try {
      const loggedInUser = req.user;
      const connectionRequests = await ConnectionRequest.find({
         toUserId: loggedInUser._id,
         status:"intrested"
      }).populate("fromUserId",["firstName","lastName"]);

      res.json({
         message:"Data fetched Successfully",
         data:connectionRequests
      })

   } catch (error) {
      res.status(400).send("Message" + error.message);
   }
})


userRouter.get("/user/connections",userAuth, async(req,res)=>{
   try {
      const loggedInUser = req.user;
      const connectionRequests = await ConnectionRequest.find({
         $or:[
            {toUserId:loggedInUser,status:"accepted"},
            {fromUserId:loggedInUser, status:"accepted"},
         ],
      }).populate("fromUserId",SAFE_USER_DATA);
       
      const data = connectionRequests.map((row)=> row.fromUserId);
      res.json({data});

   } catch (error) {
      res.status(400).send({message: error.message})
   }
})


module.exports = userRouter;
