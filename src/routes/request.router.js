const express = require('express');
const requestRouter = express.Router();
const {userAuth}=require('../middleware/auth.middleware.js').userAuth;
const {Connection}=require("../models/connection.model.js");

requestRouter.post("/request/send/:status/:toUserId",userAuth, async (req,res)=>{

    try {
        const fromUserId=req.user._id;
        const toUserId= req.params.toUserId;
        const status=req.params.status;

        const allowedStatuses=["ignored", "interested"];

        if(!allowedStatuses.includes(status)){
            return res.status(400).json({error:"Invalid status value"});
        }

        const toUser= await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({error:"Recipient user not found"});
        }
        const existingConnection= await Connection.findOne(
           {
             $or:[
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}]
            });

        if(existingConnection){
            return res.status(400).json({error:"Connection request already exists"});
        } 

        const connection= new Connection({
            fromUserId,
            toUserId,
            status
        });


        const data= await connection.save();

        res.json({
            message:"Connection request sent successfully",
            data
        });

    } catch (error) {
        res.send({error:"Failed to send connection request",details:error.message});
    }
});

requestRouter.post("/request/review/:status/:requestId",userAuth, async (req,res)=>{
    try {
        const {status, requestId}= req.params;
        const loggedInUser=req.user;
        const allowedStatus=["accepted","rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({error:"Invalid status value"});
        }


        const connectionRequest= await Connection.findOne({
            toUserId: loggedInUser._id,
            _id: requestId,
            status:"interested"
        })
        
        if(!connectionRequest){
            return res.status(404).json({error:"Connection request not found"});
        }

        connectionRequest.status=status;
        const data= await connectionRequest.save();
        res.json({
            message:"Connection request reviewed successfully",
            data
        });
    } catch (error) {
        res.send({error:"Failed to review connection request",details:error.message});
    }
})
module.exports={requestRouter};