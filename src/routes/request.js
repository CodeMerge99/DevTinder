const express = require("express");
const requestRouter = express.requestRouter();
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






































// requestRouter.post(
//   "/request/send/:status/:toUserId",
//   userAuth,
//   async (req, res) => {
//     try {
//       const user = req.user;
//       const fromUserId = req.user._id;
//       const toUserId = req.params.toUserId;
//       const status = req.params.status;

//       //toUser exist check
//       const toUser = await User.findById(toUserId);
//       if (!toUser) {
//         return res.status(400).json({
//           message: "User not found",
//           success: false,
//         });
//       }

//       //Status Check
//       const allowedStatuses = ["ignored", "intrested"];
//       if (!allowedStatuses.includes(status)) {
//         throw new Error("Invalid status type:" + status);
//       }

//       //Existing user exist check
//       const existingConnectionRequest = await ConnectionRequestModel.findOne({
//         $or: [
//           { fromUserId, toUserId },
//           { fromUserId: toUserId, toUserId: fromUserId },
//         ],
//       });
//       console.log(existingConnectionRequest);
//       if (existingConnectionRequest) {
//         throw new Error("Already sent the connection request before");
//       }

//       const connectionRequest = new ConnectionRequestModel({
//         fromUserId,
//         toUserId,
//         status,
//       });

//       const data = await connectionRequest.save();
//       res.status(200).json({
//         message: user.firstName + " is " + status + " in " + toUser.firstName,
//         data,
//         success: true,
//       });
//     } catch (error) {
//       res.status(400).json({
//         message: error.message,
//       });
//     }
//   }
// );










module.exports = requestRouter();