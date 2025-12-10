const express= require('express');
const authRouter = express.Router();
const validateSignUp=require("../utils/validateSignUp.js");
const {User}=require("../models/user.model.js");
const bcrypt = require('bcrypt');

authRouter.post("/signup",async (req,res)=>{
    console.log(req.body);
    try {
        validateSignUp(req.body);
        const {firstName,lastName,email,password}=req.body;
        const hashPassword=await bcrypt.hash(password,10);
        const user = new User(
            {
                firstName,
                lastName,
                email,
                password:hashPassword
            }
        );
        const saved = await user.save();
        console.log('User saved:');
        return res.status(201).send({ message: 'added successfully'});
    } catch (err) {
        console.error('Error saving user:', err);
        return res.status(500).send({ error: 'Failed to save user', details: err.message });
    }
});

authRouter.post("/login",async (req,res)=>{
    console.log(req.body);      
    try {
        const {email,password}=req.body;
        const user = await User.findOne({email:email});
        if(!user){
            return res.status(404).send({ error: 'User not found with email' });
        }
        
        const isPasswordValid=user.validatePassword(password);
        if(!isPasswordValid){
            return res.status(401).send({ error: 'Invalid password' });
        }   

        else {
            const token= await user.getJWT();
            console.log("Generated Token:", token);
            res.cookie("token",token);
            return res.status(202).send({ message: 'login successful',user});
        }
    } catch (err) { 
        console.error('Error during login:', err);
        return res.status(500).send({ error: 'Login failed', details: err.message });
    }
});

authRouter.post("/logout",async (req,res)=>{
    res.cookie("token",null,{expires:new Date(Date.now())});
    res.send("Logged Out!!");
});

module.exports=authRouter;