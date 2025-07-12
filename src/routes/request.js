const express = require("express");
const requestRouter = express.Router();
const User = require("../models/user");

const { userAuth} = require("../middlewares/auth");

const ConnectionRequest = require("../models/connectionRequest");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async(req,res)=>{
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      
      
      const allowedStatus = ["ignore","intrested"];
      if(!allowedStatus.includes(status)){
        return res.staus(400).json({
           msg:"Invalid Status Type" + status
        })
      }

      const toUser = await User.findOne(toUserId);
      if(!toUser){
        return res.status(401).json({
              msg:"User Not Found"
        })
      }
      
      //check if connection request already exist//
      const existingconnectionrequest = await ConnectionRequest.findOne({
            $or :[
              {fromUserId,toUserId},
              {fromUserId:toUserId , toUserId:fromUserId}
            ]
      })
      if(existingconnectionrequest){
        return res.status(400).json({
          msg:"Conection Request Already Exists!"
        })
      }
     
      const connectionrequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      })

      const data = await connectionrequest.save();
      res.json({
        success:true,
        msg:req.user.firstName +" is " + status + toUser.firstName,
        data:data
      })

    } catch (error) {
      res.send("Error" + error.message)
    }
    res.send(user.firstName + "sent the Connection Request")
})


requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        res.status(400).json({
          message: "Status not Valid",
        });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id:requestId,
        toUserId: loggedInUser._id,
        status:"intrested"
      })
       
      if(!connectionRequest){
        return res.status(404).json({
          message:"Connection request Not Found"
        })
      }

      connectionRequest.status = status;
      const Data = connectionRequest.save();
      res.json({
        message:"connection Request" + status,
        Data
      })

    } catch (error) {
      res.status(400).send("Error:" + error.message);
    }
  }
);



module.exports = requestRouter;