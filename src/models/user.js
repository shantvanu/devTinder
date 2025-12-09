const mongoose= require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt=require('bcrypt');

const userSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        lowercase:true
    },
    lastName:{
        type:String,
        required:true,
        lowercase:true,
        maxLength:50
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
    },

    age:{
        type:Number,
        min:18,
    },
    gender:{
        enum:["male", "female","other"],
        type:String,
        lowercase:true
    },
    password:{
        type:String,
        required:true ,
        minLength:5  
    }
});

const User= mongoose.model("User",userSchema);

userSchema.methods.getJWT= async function(){
const token= await jwt.sign({_id:this._id},process.env.JWT_SECRET||"mysecretkey",{expiresIn:"1d"});
return token;
}

userSchema.methods.validatePassword= async function(password){
    const hashPassword= this.password;
    return await bcrypt.compare(password,hashPassword);
}

module.exports={User};