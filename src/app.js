const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 7777;
const connectDB=require('./db');
const {User}=require("./models/user.js");
const validateSignUp=require("./utils/validate.js");
const bcrypt = require('bcrypt');
app.use(express.json());
const jwt = require('jsonwebtoken');
const cookieParser= require('cookie-parser');
const userAuth=require('./middleware/auth.js').userAuth;


app.post("/signup",async (req,res)=>{
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
})

app.post("/login",async (req,res)=>{
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

app.get("/profile",userAuth,async (req,res)=>{
    try {
        const user= req.user;
    res.send({message:"user profile fetched successfully",user});
    
} catch (error) {
        throw new Error("Unauthorized access");   
    }
})

app.get("/feed",async (req,res)=>{
    try {
        const user = await User.find({});
        return res.status(202).send({ message: 'all found successfully',user});
    } catch (err) {
        console.error('Error saving user:', err);
        return res.status(500).send({ error: 'Failed to find user', details: err.message });
    }
})

connectDB()
.then(() => {
    console.log("database is connected successfullyy");
    app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})})
.catch((err) => {
    console.error('Failed to connect to the database', err);
});

