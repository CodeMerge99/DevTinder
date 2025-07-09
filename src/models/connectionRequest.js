const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required:true,
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required:true,
  },
  status: {
    type: String,
    required:true,
    enum: {
      values: ["ignore", "intrested", "accepted", "rejected"],
      message: `{VALUES} Status Not Supported`,
    },
  },
},
{
    timestamps:true
});

connectionRequestSchema.index({fromUserId:1, touserId:1});

connectionRequestSchema.pre("save", function(next){
  const connectionRequest = this;
  if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw new Error("Cannot send Connection Request to Yourself");
  }
  next();
});


const ConnectionRequest = new mongoose.model("ConnectionRequest", connectionRequestSchema);
exports.module = ConnectionRequest; 