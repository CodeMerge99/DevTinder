const express = require("express");
const userRouter = express.Router();
const { userAuth} = require("../middlewares/auth");
const User = require("../models/user");

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
      }).populate("fromUserId",SAFE_USER_DATA).populate("toUserId",SAFE_USER_DATA);
       
      const data = connectionRequests.map((row)=> {
         if(row.fromUserId._id.toString() == loggedInUser._id.toString()){
            return row.toUserId;
         }
         return row.fromUserId;
      });
      res.json({connectionRequests});

   } catch (error) {
      res.status(400).send({message: error.message})
   }
})

//user feed should not show//
//1. his own card//
//2. his accepted connections//
//3. ignored people//
//4. already sent connections//

userRouter.get("/feed", userAuth, async(req,res)=>{
   try {
      const loggedInUser = req.user;
      //finding all the connection request(sent + recieved)//
      const connectionRequest = await ConnectionRequest.find({
         $or:
         [{fromUserId:loggedInUser._id},{toUserId:loggedInUser._id}]
      }).select("fromUserId toUserId")

      //hiding users from feed to whom user has sent connection request or accepted request//
      const hideUsersFromFeed = new Set();
      connectionRequest.forEach(req =>{
         hideUsersFromFeed.add(req.fromUserId.toString());
         hideUsersFromFeed.add(req.toUserId.toString());
      })

      const users = await User.find({
         $and:[
           {_id:{$nin: Array.find(hideUsersFromFeed)}},
           {_id:{$ne: loggedInUser._id}},
         ]
      }).select(SAFE_USER_DATA);
      
      res.send(users);
   } catch (error) {
      res.status(400).json({message: error.message})
   }
})

module.exports = userRouter;
