const express = require('express');
const requestRouter = express.Router();
const {userAuth}=require('../middleware/auth.middleware.js').userAuth;
const {connection}=require("../models/connection.model.js");

requestRouter.post("/request/send/:status/:toUserId",userAuth, async (req,res)=>{

    try {
        const fromUserId=req.user._id;
        const toUserId= req.params.toUserId;
        const status=req.params.status;

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

module.exports={requestRouter};