const mongoose= require("mongoose");

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

module.exports={User};