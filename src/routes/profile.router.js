const express=require('express');
const profileRouter=express.Router();
const {userAuth}=require('../middleware/auth.middleware.js').userAuth;
const {validateProfileUpdate}=require("../utils/validateEditProfile.js");

profileRouter.get("/profile/view",userAuth,async (req,res)=>{
    try {
        const user= req.user;
    res.send({message:"user profile fetched successfully",user});
    
} catch (error) {
        throw new Error("Unauthorized access");   
    }
})

profileRouter.patch("/profile/update",userAuth,async (req,res)=>{
    try {
        if(!validateProfileUpdate(req)){
            return res.status(400).send({error:"Invalid fields in update"});
        }

        const loggedInUser=req.user;
        Object.keys(req.body).forEach((key)=> loggedInUser[key]=req.body[key]||loggedInUser[key]);
        res.send(`$(loggedInUser.firstName) profile updated successfully`);
    
} catch (error) {
   res.status(500).send({error:"Profile update failed",details:error.message});
    }
})