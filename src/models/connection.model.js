const mongoose= require("mongoose");

const connectionSchema= new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        enum:["ignored","interested","accepted","rejected"]
    }
},{timestamps:true});

connectionSchema.pre('save', async function(next){

    const connectionRequest= this;

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        return next(new Error("Cannot send connection request to oneself"));
    }   
})

const Connection= mongoose.model("Connection",connectionSchema);
module.exports={Connection};