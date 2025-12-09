const jwt=require('jsonwebtoken');
const User=require('../models/user');    
    
    const userAuth=async (req,res,next)=>{
        try {       
    const token=req.cookies.token||req.header("Authorization").replace("Bearer ","");
    if(!token)  
    {
        throw new Error("Unauthorized access");
    }
    console.log("Token:", token);
    const {_id}= jwt.verify(token,process.env.JWT_SECRET||"mysecretkey");
    console.log("_id from token:", _id);    
    const user= await User.findById(_id);

    if(!user){
        throw new Error(" user not found");
    }
    req.user=user;
    next();
        }
        catch(error){
res.status(401).send({error:"Unauthorized access",details:error.message});
        }
    }

    module.exports={userAuth};